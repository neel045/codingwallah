const mongoose = require("mongoose")

const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },

    token: {
        type: String,
        required: true,
    },

    createAt: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
})

const Token = mongoose.model("Token", tokenSchema)

module.exports = Token
