const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const multer = require("multer")
const sharp = require("sharp")
const handleAsync = require("./handleAsync")
const crypto = require("crypto")

const multerStorage = multer.memoryStorage()

const multerImageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else cb("only upload image", false)
}
const uploadImage = multer({
    storage: multerStorage,
    fileFilter: multerImageFilter,
})

const uploadProfilePhoto = uploadImage.single("photo")
const uploadCourseThumbnail = uploadImage.single("photo")

const resizeUserProfilePhoto = handleAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.body.photo = `user-${crypto.randomBytes(16).toString("hex")}-${new Date().getTime()}.jpeg`

    await sharp(req.file.buffer)
        .resize(180, 180)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/users/${req.body.photo}`)
    next()
})

const resizeCourseThumbail = handleAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.body.photo = `course-${crypto.randomBytes(16).toString("hex")}-${new Date().getTime()}.jpeg`

    await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/courses/${req.body.photo}`)
    next()
})

const multerVideoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("video")) {
        cb(null, true)
    } else cb("only upload video", false)
}

const uploadVideo = multer({
    storage: multerStorage,
    fileFilter: multerVideoFilter,
})

const uploadCourseVideo = uploadVideo.single("courseVideo")

class JsonResponse {
    constructor(statusCode) {
        this.statusCode = statusCode
    }

    success = (res, message, data) => {
        return res.status(this.statusCode).json({
            status: true,
            message: message,
            data: data,
        })
    }

    error = (res, error, data) => {
        return res.status(this.statusCode).json({
            status: false,
            error,
            data,
        })
    }
}

module.exports = {
    JsonResponse,
    uploadProfilePhoto,
    resizeUserProfilePhoto,
    uploadCourseThumbnail,
    resizeCourseThumbail,
    uploadCourseVideo,
}
