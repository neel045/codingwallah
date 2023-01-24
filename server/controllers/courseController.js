const Course = require("../models/Course")
const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")
const {
    courseValidator,
    courseUpdateValidator,
    addLessonValidator,
} = require("../utils/validators")

module.exports.isEducator = handleAsync(async (req, res, next) => {
    if (!req.user.isEducator) {
        return new JsonResponse(400).error(res, "not allowed")
    }
    next()
})

module.exports.createCourse = handleAsync(async (req, res, next) => {
    const { error } = courseValidator(req.body)
    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message}`, "")
        )
    }
    req.body.instructor = req.user._id

    const course = await new Course(req.body).save()
    await Course.populate(course, { path: "instructor", select: "-password" })

    return new JsonResponse(201).success(res, "course has been created", course)
})

module.exports.getCourseByEducators = handleAsync(async (req, res, next) => {
    const filter = {
        instructor: req.params.userId,
    }
    if (req.params.userId != req.user._id) filter["published"] = true
    const courses = await Course.find(filter).populate("instructor", "-password").exec()
    if (courses.length == 0) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "All courses By educator", courses)
})

module.exports.getCourse = handleAsync(async (req, res, next) => {
    const course = await Course.findById(req.params.courseId)
        .populate("instructor", "-password")
        .exec()
    if (!course) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "", course)
})

module.exports.deleteCourse = handleAsync(async (req, res, next) => {
    const course = await Course.findOneAndDelete(
        { _id: req.params.courseId, instructor: req.user._id },
        { returnOriginal: true }
    )
    if (!course) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "course has been deleted", course)
})

module.exports.updateCourse = handleAsync(async (req, res, next) => {
    const { error } = courseUpdateValidator(req.body)
    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message}`, "")
        )
    }

    const {
        name,
        photo,
        description,
        summary,
        category,
        lessons,
        learningOutcomes,
        published,
        type,
        price,
    } = req.body

    const updateData = {
        name,
        photo,
        description,
        summary,
        category,
        published,
        type,
        price,
    }

    if (lessons) updateData["lessons"] = JSON.parse(lessons)
    if (learningOutcomes) updateData["learningOutcomes"] = JSON.parse(learningOutcomes)

    const course = await Course.findOneAndUpdate(
        { _id: req.params.courseId, instructor: req.user._id },
        updateData,
        { returnOriginal: false }
    )
        .populate("instructor", "-password")
        .exec()

    if (!course) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "course has been updated", course)
})

module.exports.addlesson = handleAsync(async (req, res, next) => {
    const { courseId, lesson } = req.body

    const { error } = addLessonValidator(lesson)
    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message}`, "")
        )
    }

    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            $push: { lessons: lesson },
        },
        { returnOriginal: false }
    )
        .populate("instructor", "-password")
        .exec()
    if (!course) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "lesson has been added", course)
})

module.exports.removeLesson = handleAsync(async (req, res, next) => {
    const { courseId, lesson } = req.body

    const course = await Course.findByIdAndUpdate(courseId, {
        $pull: { lessons: { _id: lesson._id } },
    })
        .populate("instructor", "-password")
        .exec()
    if (!course) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "lesson has been added", course)
})

module.exports.searchCourse = handleAsync(async (req, res, next) => {
    const { searchQuery } = req.query

    // $or: [{ name: new RegExp(name) }, { category: new RegExp(category) }],

    const courses = await Course.find({ name: { $regex: new RegExp(searchQuery, "i") } })

    if (courses.length == 0) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "found", courses)
})

module.exports.getAllCourses = handleAsync(async (req, res, next) => {
    const courses = await Course.find({ published: true })
        .populate("instructor", "-password")
        .exec()

    if (courses.length == 0) return new JsonResponse(400).error(res, "Course Not Found")

    return new JsonResponse(200).success(res, "found", courses)
})
