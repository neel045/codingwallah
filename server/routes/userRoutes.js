const express = require("express")
const userController = require("../controllers/userController")
const { isSignedIn } = require("../middlewares/auth")
const { uploadProfilePhoto, resizeUserProfilePhoto } = require("../utils/helper")

const router = express.Router()

router.use(isSignedIn)

router.get("/:userId", userController.getUser)
router.patch("/update-me", uploadProfilePhoto, resizeUserProfilePhoto, userController.updateUser)
router.delete("/delete-me", userController.deleteUser)

module.exports = router
