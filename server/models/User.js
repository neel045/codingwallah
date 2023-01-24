const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        photo: {
            type: String,
            default: "default.jpg",
        },

        verified: {
            type: Boolean,
            default: false,
        },

        active: {
            type: Boolean,
            default: true,
        },

        isEducator: {
            type: Boolean,
            default: false,
        },

        about: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User
