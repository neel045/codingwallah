const express = require("express")
const authController = require("../controllers/authController")
const { isSignedIn } = require("../middlewares/auth")
const { resizeUserProfilePhoto, uploadProfilePhoto } = require("../utils/helper")

const router = express.Router()

router.route("/signup").post(uploadProfilePhoto, resizeUserProfilePhoto, authController.signup)
router.post("/signin", authController.signin)

router.get("/verify-email/:userId/:token", authController.verifyEmail)
router.post("/forget-password", authController.forgetPassword)

router
    .route("/reset-password/:userId/:token")
    .get(authController.verifyResetPasswordToken)
    .post(authController.resetPassword)

router.post("/change-password", isSignedIn, authController.changePassword)

module.exports = router
