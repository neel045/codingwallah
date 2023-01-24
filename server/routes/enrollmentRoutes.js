const express = require("express")
const router = express.Router()
const enrollmentController = require("../controllers/enrollmentController")
const { isSignedIn } = require("../middlewares/auth")

router.route("/payment-verification").post(enrollmentController.paymentVerification)
router.use(isSignedIn)
router.get("/enrolled", enrollmentController.listEnrollmentsByUser)
router.post("/new/:courseId", enrollmentController.buyCourse, enrollmentController.createEnrollment)
router.patch("/complete-lesson/:enrollmentId", enrollmentController.completeLesson)

router.route("/:enrollmentId").get(enrollmentController.getEnrollmentById)
router.get("/stats/:courseId", enrollmentController.enrollmentStats)

module.exports = router
