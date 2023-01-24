const mongoose = require("mongoose")

const enrollmentSchema = mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        enrolled: {
            type: Date,
            default: Date.now,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        lessonStatus: [
            {
                lesson: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Lesson",
                },
                complete: Boolean,
            },
        ],

        completed: Date,
        order_id: String,
        payment_id: String,
        paid: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true })

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

module.exports = Enrollment
