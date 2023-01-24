const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")
const User = require("../models/User")
const Joi = require("joi")
const Razorpay = require("razorpay")

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports.updateUser = handleAsync(async (req, res, next) => {
    const { name, photo, about, isEducator } = req.body

    const { error } = Joi.object({
        name: Joi.string().min(2).max(50).required().trim().label("Name"),
        photo: Joi.string().allow("").label("Photo"),
        about: Joi.string().allow("").label("About"),
        isEducator: Joi.boolean().label("Is Educator"),
    }).validate({ name, photo, about, isEducator })

    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => {
                return `${msg} ${detail.message}`
            })
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, photo, about, isEducator: Boolean(isEducator) },
        { returnOriginal: false }
    ).select({ password: 0 })

    if (!user) return new JsonResponse(400).error(res, "not found")

    return new JsonResponse(203).success(res, "updated", user)
})

module.exports.deleteUser = handleAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            active: false,
        },
        {
            returnOriginal: false,
        }
    )

    if (!user) return new JsonResponse(404).error(res, "not found")

    return new JsonResponse(200).success(res, "deleted Successfully", user)
})

module.exports.getUser = handleAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId).select({ password: 0 })
    if (!user) return new JsonResponse(404).error(res, "User not found")

    return new JsonResponse(200).success(res, "Got user Successfully", user)
})

module.exports.createRazorPayAccount = handleAsync(async (req, res, next) => {})
