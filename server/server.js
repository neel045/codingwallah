const app = require("./app")
const mongoose = require("mongoose")

const port = process.env.PORT || 4000
let DB

if (process.env.ENV === "development") {
    DB = process.env.DB_LOCAL_URI
}

mongoose.set("strictQuery", false)
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err))

app.listen(port, () => {
    console.log(`listening at ${port}`)
})

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message)
    console.log("UNHANDLED REJECTION! Shutting Down...")
    server.close(() => {
        process.exit(1)
    })
})
