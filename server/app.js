const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
dotenv.config()

const authRoutes = require("./routes/authRoutes")
const courseRoutes = require("./routes/courseRoutes")
const enrollmentRoutes = require("./routes/enrollmentRoutes")
const userRoutes = require("./routes/userRoutes")
const videoRoutes = require("./routes/videoRoutes")

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors("*"))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/enrollment", enrollmentRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)

app.all("*", (req, res) => {
    res.status(404).json({ message: "not found" })
})

module.exports = app
