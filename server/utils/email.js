// const nodemailer = require("nodemailer")
const Token = require("../models/Token")
const crypto = require("crypto")
const sendgrid = require("@sendgrid/mail")
const { JsonResponse } = require("./helper")
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = async (email, subject, html) => {
    try {
        await sendgrid.send({
            to: email,
            from: process.env.GMAIL_ID,
            subject,
            html,
        })
        console.log("email has been sent")
    } catch (error) {
        console.log(error)
    }
}

const sendEmailVerification = async (user) => {
    try {
        let token = await Token.findOne({ _id: user._id })

        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save()
        }

        const url = `${process.env.FRONTEND_URI}/verify-email/${user._id}/${token.token}`

        const html = `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>CondingWallah</title>
    </head>
    <body>
        <h3>Hello ${user.name}</h3>
        
        <p>
            You registered an account on CodingWallah, before being able to use your account you
            need to verify that this is your email address by clicking here: <a href="${url}">Verify Email</a>
        </p>
        
        <p>Kind Regards, CodingWallah</p>
    </body>
</html>`

        await sendEmail(user.email, "CodingWallah: Email Verification", html)
    } catch (error) {
        console.log(error)
    }
}

const sendForgotPasswordToken = async (user) => {
    try {
        let token = await Token.findOne({ _id: user._id })

        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save()
        }

        const url = `${process.env.FRONTEND_URI}/reset-password/${user._id}/${token.token}`

        const html = `
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>CondingWallah</title>
    </head>
    <body>
        <h3>Hello ${user.name}</h3>
        
        <p>
        We received a request to reset your password. Please create a new password by clicking this link: <a href="${url}">
        ${url}</a>
        </p>

        <p>This request will expire in 15 minutes.</p>

        <p>Kind Regards, CodingWallah</p>
    </body>
</html>`

        await sendEmail(user.email, "CodingWallah: Reset Your Password", html)
    } catch (error) {
        console.log(error)
        return new JsonResponse(400).error(res, error.message)
    }
}

const sendInvoice = async (user, course, paymentDetails) => {
    const html = `
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <title>CondingWallah</title>
        </head>
        <body>
            <h3>Hello ${user.name}</h3>
            
            <p>
            Thank you for purchasing ${course.name} from CodingWallah.
            </p>
            <p>Purchase Details: </p>
            <p>Order Id: ${paymentDetails.razorpay_order_id}</p>
            <p>Payment Id: ${paymentDetails.razorpay_payment_id}</p>
            <p>Happy Learning, go to my Enrollments page and strt learning</p>

            <p>Kind Regards, CodingWallah</p>
        </body>
    </html>`

    try {
        await sendEmail(user.email, "CodingWallah: Confirmed Purchase", html)
    } catch (error) {
        console.log(error)
        return new JsonResponse(400).error(res, error.message)
    }
}

module.exports = { sendEmailVerification, sendForgotPasswordToken, sendInvoice }
