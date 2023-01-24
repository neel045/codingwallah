const handleAsync = require("../utils/handleAsync")
const ffmpeg = require("fluent-ffmpeg")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const toStream = require("buffer-to-stream")
const { JsonResponse } = require("../utils/helper")
const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")

module.exports.uploadVideo = handleAsync(async (req, res, next) => {
    if (!req.file) return new JsonResponse(400).error(res, "file not found")
    const { courseId } = req.query
    const course = await Course.findOne({ _id: courseId, instructor: req.user._id })
    if (!course) return new JsonResponse(400).error(res, "Invalid courseId")

    const videoReadStream = toStream(req.file.buffer)
    const fileName = `course-video-${courseId}-${crypto
        .randomBytes(8)
        .toString("hex")}-${new Date().getTime()}`

    const result = new ffmpeg(videoReadStream)
        .on("progress", function (progress) {
            console.log({ progress })
        })
        .size("?x720")
        .saveToFile(`public/videos/${fileName}${path.extname(req.file.originalname)}`)
        .on("end", function () {
            return new JsonResponse(201).success(res, "video Uploaded", { fileName })
        })
})

module.exports.streamVideo = handleAsync(async (req, res, next) => {
    const { videoId } = req.params
    const courseId = videoId.split("-")[2]

    const enrollment = await Enrollment.findOne({
        course: courseId,
        student: req.user._id,
        paid: true,
    })
    if (!enrollment) return new JsonResponse(401).error(res, "Unauthorized Request")

    const { range } = req.headers
    if (!range) {
        return new JsonResponse(400).error(res, "Requires range header")
    }

    const videoPath = `public/videos/${videoId}.mp4`
    const videoSize = fs.statSync(videoPath).size
    const CHUNK_SIZE = 10 ** 6

    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})
