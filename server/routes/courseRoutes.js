const express = require("express")

const router = express.Router()
const courseController = require("../controllers/courseController")
const { isSignedIn } = require("../middlewares/auth")
const { uploadCourseThumbnail, resizeCourseThumbail } = require("../utils/helper")

router.use(isSignedIn)
router.get("/", courseController.getAllCourses)
router.get("/search", courseController.searchCourse)
router.route("/by/:userId").get(courseController.getCourseByEducators)
router.get("/:courseId", courseController.getCourse)

router.use(courseController.isEducator)
router
    .route("/new")
    .post(uploadCourseThumbnail, resizeCourseThumbail, courseController.createCourse)
// router.patch("/add-lesson", courseController.addlesson)
// router.patch("/remove-lesson", courseController.removeLesson)

router
    .route("/:courseId")
    .patch(uploadCourseThumbnail, resizeCourseThumbail, courseController.updateCourse)
    .delete(courseController.deleteCourse)

module.exports = router
