const Enrollment = require("../models/Enrollment")
const handleAsync = require("../utils/handleAsync")
const Course = require("../models/Course")
const { JsonResponse } = require("../utils/helper")
const crypto = require("crypto")
const Razorpay = require("razorpay")
const { sendInvoice } = require("../utils/email")

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports.createEnrollment = handleAsync(async (req, res, next) => {
    const course = req.course
    let newEnrollment
    let enrollment
    let order
    if (course.type == "paid") {
        order = req.order
        enrollment = await Enrollment.findOneAndUpdate(
            {
                course: course._id,
                student: req.user._id,
                paid: false,
            },
            {
                order_id: req.order.id,
            }
        )
        if (enrollment) return new JsonResponse(400).success(res, "PAY NOW", { order })

        newEnrollment = {
            course: course._id,
            student: req.user._id,
            order_id: req.order.id,
        }
    } else {
        enrollment = await Enrollment.findOne({ course: course._id, student: req.user._id })
        if (enrollment) return new JsonResponse(400).error(res, "Already Erolled")

        newEnrollment = {
            course: course._id,
            student: req.user._id,
            paid: true,
        }
    }

    newEnrollment.lessonStatus = course.lessons.map((lesson) => ({
        lesson: lesson,
        complete: false,
    }))
    enrollment = await new Enrollment(newEnrollment).save()

    if (course.type == "free") {
        await Enrollment.populate(enrollment, {
            path: "course",
            populate: { path: "instructor", select: "-password" },
        })
        await Enrollment.populate(enrollment, { path: "student", select: "-password" })
        return new JsonResponse(200).success(res, "new Enrollment has created", enrollment)
    } else {
        return new JsonResponse(200).success(res, "new Enrollment has created", { order })
    }
})

module.exports.listEnrollmentsByUser = handleAsync(async (req, res, next) => {
    const enrollments = await Enrollment.find({ student: req.user._id })
        .populate("course")
        .populate("student", "_id name photo")
        .exec()

    if (enrollments.length == 0) return new JsonResponse(404).error(res, "No enrollments Found")

    return new JsonResponse(200).success(res, "found", enrollments)
})

module.exports.completeLesson = handleAsync(async (req, res, next) => {
    const { lesson } = req.body

    const updateData = {
        "lessonStatus.$.complete": true,
    }

    let enrollment = await Enrollment.findOneAndUpdate(
        {
            _id: req.params.enrollmentId,
            "lessonStatus.lesson": lesson,
        },
        updateData,
        {
            returnOriginal: false,
        }
    )
        .populate("course")
        .populate("student", "_id name photo")
        .exec()

    console.log({ status: enrollment.lessonStatus.toString() })

    if (!enrollment.lessonStatus.some((lesson) => lesson.complete == false)) {
        enrollment = await Enrollment.findByIdAndUpdate(
            enrollment._id,
            { completed: new Date() },
            { returnOriginal: false }
        )
            .populate("course")
            .populate("student", "_id name photo")
            .exec()
    }

    if (!enrollment) return new JsonResponse(404).error(res, "Enrollment not found")

    return new JsonResponse(200).success(res, "lesson completed", enrollment)
})

module.exports.getEnrollmentById = handleAsync(async (req, res, next) => {
    const { enrollmentId } = req.params

    const enrollment = await Enrollment.findById(enrollmentId)
        .populate({
            path: "course",
            populate: {
                path: "instructor",
            },
        })
        .populate("student", "_id name")

    return new JsonResponse(200).success(res, "found", enrollment)
})

module.exports.enrollmentStats = handleAsync(async (req, res, next) => {
    const stats = {}

    stats.totalEnrolled = await Enrollment.find({ course: req.params.courseId }).countDocuments()
    stats.totalCompleted = await Enrollment.find({ course: req.params.courseId })
        .exists("completed", true)
        .countDocuments()

    return new JsonResponse(200).success(res, "successful", stats)
})

module.exports.buyCourse = handleAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId)
    if (!course) return new JsonResponse(404).error(res, "Invalid course Id")
    req.course = course
    if (course.type == "paid") {
        const options = {
            amount: Number(course.price) * 100,
            currency: "INR",
            receipt: crypto.randomBytes(16).toString("hex"),
        }
        const order = await instance.orders.create(options)
        if (!order) return new JsonResponse(500).error(res, "something went wrong")
        req.order = order
    }
    next()
})

module.exports.paymentVerification = handleAsync(async (req, res, next) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex")

    const signatureMatched = generatedSignature == razorpay_signature
    if (!signatureMatched) return res.redirect(process.env.FRONTEND_URI)

    if (signatureMatched) {
        const enrollment = await Enrollment.findOneAndUpdate(
            { order_id: razorpay_order_id },
            {
                payment_id: razorpay_payment_id,
                paid: true,
            }
        )
            .populate("course")
            .populate("student", "-password")
            .exec()
        if (!enrollment) return res.redirect(process.env.FRONTEND_URI)

        await sendInvoice(enrollment.student, enrollment.course, {
            razorpay_order_id,
            razorpay_payment_id,
        })

        return res.redirect(`${process.env.FRONTEND_URI}/my-enrollments`)
    } else {
        return res.redirect(`${process.env.FRONTEND_URI}`)
    }
})
