const bcrypt = require("bcrypt")
const passwordComplexity = require("joi-password-complexity")
const jwt = require("jsonwebtoken")

const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")
const { signupValidator } = require("../utils/validators")
const User = require("../models/User")
const { sendEmailVerification, sendForgotPasswordToken } = require("../utils/email")
const Token = require("../models/Token")
const Joi = require("joi")

module.exports.signup = handleAsync(async (req, res, next) => {
    const { error } = signupValidator(req.body)
    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message},`, ""),
            req.body
        )
    }

    const { name, email, password, photo } = req.body

    let user = await User.findOne({ email })
    if (user) return new JsonResponse(400).error(res, "User Already Exists")

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))

    user = await new User({
        name,
        email,
        password: hashedPassword,
        photo,
    }).save()

    await sendEmailVerification(user)

    return new JsonResponse(201).success(
        res,
        "An email has been sent to your registered Email Account, please verify"
    )
})

module.exports.verifyEmail = handleAsync(async (req, res, next) => {
    const { userId, token: userToken } = req.params
    const user = await User.findById(userId)
    if (!user) return new JsonResponse(404).error(res, "user does not exists")

    let token = await Token.findOneAndDelete({ userId: user._id, token: userToken })
    if (!token) return new JsonResponse(400).error(res, "Invalid Token")

    await User.findByIdAndUpdate(user._id, { verified: true })
    await token.remove()

    return new JsonResponse(200).success(res, "Email has been verified")
})

module.exports.signin = handleAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return new JsonResponse(404).error(res, "empty fields")
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) return new JsonResponse(404).error(res, "user does not exists")

    const isMatched = await bcrypt.compare(req.body.password, user.password)
    if (!isMatched) return new JsonResponse(400).error(res, "Invalid User Credentials")

    if (!user.verified) {
        await sendEmailVerification(user)
        console.log(user)
        return new JsonResponse(201).error(
            res,
            "You are not verified. An email has been sent to your registered Email Account, please verify"
        )
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15d" })

    return new JsonResponse(200).success(res, "Login Successful", {
        user: {
            name: user.name,
            email: user.email,
            photo: user.photo,
            isEducator: user.isEducator,
            active: user.active,
            _id: user._id,
            verified: user.verified,
            about: user.about,
        },

        token: token,
    })
})

module.exports.forgetPassword = handleAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return new JsonResponse(404).error(res, "user does not exists")

    await sendForgotPasswordToken(user)

    return new JsonResponse(201).success(
        res,
        "a link to reset password has been sent to your email"
    )
})

module.exports.verifyResetPasswordToken = handleAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(404).error(res, "user does not exists")

    let token = await Token.findOne({ userId: user._id, token: req.params.token })
    if (!token) return new JsonResponse(400).error(res, "Invalid Token")
    await User.findByIdAndUpdate(user._id, { verified: true })

    return new JsonResponse(200).success(res, "Valid Link")
})

module.exports.resetPassword = handleAsync(async (req, res, next) => {
    const { password } = req.body

    const { error } = Joi.object({
        password: passwordComplexity().min(8).max(14).required().trim().label("Password"),
    }).validate({ password })

    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message},`, ""),
            req.body
        )
    }

    const user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(404).error(res, "user does not exists")

    let token = await Token.findOne({ userId: user._id, token: req.params.token })
    if (!token) return new JsonResponse(400).error(res, "Invalid Token")

    await token.remove()

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT))
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    return new JsonResponse(200).success(res, "Password has been reseted")
})

module.exports.changePassword = handleAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body
    const { error } = Joi.object({
        newPassword: passwordComplexity().min(8).max(14).required().trim().label("Password"),
    }).validate({ newPassword: req.body.newPassword })

    if (error) {
        return new JsonResponse(400).error(
            res,
            error.details.reduce((msg, detail) => `${msg} ${detail.message},`, ""),
            req.body
        )
    }

    const user = await User.findById(req.user._id)
    if (!user) return new JsonResponse(404).error(res, "User not found")

    const isMatched = await bcrypt.compare(currentPassword, user.password)
    if (!isMatched) return new JsonResponse(400).error(res, "Wrong Password")

    const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT))
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    return new JsonResponse(203).success(res, "Password Changed Successfully")
})
