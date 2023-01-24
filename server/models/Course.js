const mongoose = require("mongoose")

const lessonSchema = mongoose.Schema({
    title: String,
    content: String,
    resource_link: String,
})

const Lesson = mongoose.model("Lesson", lessonSchema)

const courseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        photo: {
            type: String,
            required: [true, "image is required"],
        },

        summary: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        learningOutcomes: [String],

        category: {
            type: String,
            required: [true, "Category is Required"],
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        published: {
            type: Boolean,
            default: false,
        },

        type: String,

        price: Number,

        lessons: [lessonSchema],
    },
    {
        timestamps: true,
    }
)

const Course = mongoose.model("Course", courseSchema)

module.exports = Course
