const express = require("express")

const router = express.Router()
const courseController = require("../controllers/courseController")
const videoController = require("../controllers/videoController")
const { isSignedIn, videoSignedIn } = require("../middlewares/auth")
const { uploadCourseVideo } = require("../utils/helper")

router.get("/stream/:videoId", videoSignedIn, videoController.streamVideo)
router.post(
    "/upload-video",
    isSignedIn,
    courseController.isEducator,
    uploadCourseVideo,
    videoController.uploadVideo
)

module.exports = router
