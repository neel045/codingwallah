const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { JsonResponse } = require("../utils/helper")

module.exports.isSignedIn = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return new JsonResponse(400).error(res, "not authorized")
        }

        const token = req.headers.authorization.split(" ")[1]
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        if (!id) return new JsonResponse(400).error(res, "Invalid Token")

        const user = await User.findById(id)
        if (!user) return new JsonResponse(400).error(res, "User Not found")

        if (!user.active)
            return new JsonResponse(404).error(
                res,
                "Your account has been removed if you wants to restore you can"
            )

        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return new JsonResponse(500).error(res, "Something went wrong")
    }
}

module.exports.videoSignedIn = async (req, res, next) => {
    try {
        if (!req.query.token) {
            return new JsonResponse(400).error(res, "not authorized")
        }
        const { token } = req.query
        const { id } = jwt.verify(token, process.env.JWT_SECRET)
        if (!id) return new JsonResponse(400).error(res, "Invalid Token")

        const user = await User.findById(id)
        if (!user) return new JsonResponse(400).error(res, "User Not found")

        if (!user.active)
            return new JsonResponse(404).error(
                res,
                "Your account has been removed if you wants to restore you can"
            )

        req.user = user
        next()
    } catch (error) {
        return new JsonResponse(500).error(res, "Something went wrong")
    }
}
