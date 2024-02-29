const slug = require('slug')
const fs = require('fs')
const User = require('../models').users
const jwt = require('jsonwebtoken')
const sendMail = require('../config/emailConfig')
const otpGenerator = require('otp-generator')
const { ServerError } = require('../config/ServerUtils')

// Function to create a new user account
exports.CreateAccount = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body

        // Validate required fields
        if (!username) return res.json({ status: 404, msg: `Username is required` })
        if (!email) return res.json({ status: 404, msg: `Email address is required` })
        if (!password) return res.json({ status: 404, msg: `Password is required` })
        if (password.length < 6) return res.json({ status: 404, msg: `Password must be at least 6 characters` })
        if (!confirm_password) return res.json({ status: 404, msg: `Confirm password is required` })
        if (confirm_password !== password) return res.json({ status: 404, msg: `Passwords mismatched` })

        // Check if email already exists
        const findEmail = await User.findOne({ where: { email: email } })
        if (findEmail) return res.json({ status: 400, msg: `Email already exists` })

        // Validate profile image existence
        if (!req.files) return res.json({ status: 404, msg: `Profile image is required` })
        const imageData = req.files.image

        // Create directory for profile images if it doesn't exist
        const filePath = './public/profiles'
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath)
        }

        // Generate a unique image name based on the username
        const imageName = `${slug(username, '-')}.jpg`

        // Create a new user record in the database
        const user = await User.create({
            image: imageName,
            username,
            email,
            password
        })

        // Save the profile image to the specified directory
        await imageData.mv(`${filePath}/${imageName}`)

        const otp = otpGenerator.generate(6, { specialChars: false })
        const content = `
        <div>Copy and paste your account verification code below</div>
        <h1 style="color: blue; font-size: 20rem;margin-top: 2rem;">${otp}</h1>
        `
        user.resetcode = otp
        await user.save()
        await sendMail({ subject: 'Email Verification Code', to: user.email, html: content })

        return res.json({ status: 201, msg: `Account created successfully` })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.ResendOtpVerification = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.json({ status: 404, msg: 'Enter a valid email address' })
        const findAccount = await User.findOne({ where: { email: email } })
        if (!findAccount) return res.json({ status: 404, msg: `Account does not exists with us` })
        const otp = otpGenerator.generate(6, { specialChars: false })
        const content = `
        <div>Copy and paste your account verification code below</div>
        <h1 style="color: blue; font-size: 20rem;margin-top: 2rem;">${otp}</h1>
        `
        findAccount.resetcode = otp
        await findAccount.save()
        await sendMail({ subject: 'Resend: Email Verification Code', to: findAccount.email, html: content })

        return res.json({ status: 200 })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.ValidateOtp = async (req, res) => {
    try {
        const { email, code } = req.body
        if (!email || !code) return res.json({ status: 404, msg: 'Incomplete request found' })
        const findAccount = await User.findOne({ where: { email: email } })
        if (!findAccount) return res.json({ status: 404, msg: `Account does not exists with us` })
        // check if the right opt was supplied
        if (code !== findAccount.resetcode) return res.json({ status: 404, msg: 'Invalid code entered' })
        findAccount.resetcode = null
        findAccount.email_verified = 'true'
        await findAccount.save()

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: findAccount.id, role: findAccount.role }, process.env.JWT_SECRET, { expiresIn: 3 })

        return res.json({ status: 200, msg: 'Email address successfully verified', token })
    } catch (error) {
        ServerError(res, error)
    }
}

// Function to handle user login
exports.LoginAccount = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate required fields
        if (!email || !password) return res.json({ status: 404, msg: `Incomplete request found` })

        // Check if the user with the provided email exists
        const findEmail = await User.findOne({ where: { email: email } })
        if (!findEmail) return res.json({ status: 400, msg: `Account not found` })

        // Verify if the provided password matches the stored password
        if (password !== findEmail.password) return res.json({ status: 404, msg: `Wrong password detected` })

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: findEmail.id, role: findEmail.role }, process.env.JWT_SECRET, { expiresIn: '60min' })

        return res.json({ status: 200, msg: `Login successfully`, token })
    } catch (error) {
        ServerError(res, error)
    }
}

// Function to retrieve user profile information
exports.GetProfile = async (req, res) => {
    try {
        // Find user by their ID (retrieved from the JWT token)
        const user = await User.findByPk(req.user)
        if (!user) return res.json({ status: 404, msg: `Account not found` })

        // Return user profile information
        return res.json({ status: 200, msg: user })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.FindAccountByEmail = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ where: { email: email } })
        if (!user) return res.json({ status: 404, msg: `Looks like your account doesn't exists with us` })
        const otp = otpGenerator.generate(6, { specialChars: false })
        const content = `
        <div>Copy and paste your account verification code below</div>
        <h1 style="color: blue; font-size: 20rem;margin-top: 2rem;">${otp}</h1>
        `
        user.resetcode = otp
        await user.save()
        await sendMail({ subject: 'Resend: Email Verification Code', to: user.email, html: content })

        return res.json({ status: 200 })
    } catch (error) {
        ServerError(res, error)
    }
}
exports.VerifyOtpForPassword = async (req, res) => {
    try {
        const { email, code } = req.body
        if (!email || !code) return res.json({ status: 404, msg: 'Incomplete request found' })
        const findAccount = await User.findOne({ where: { email: email } })
        if (!findAccount) return res.json({ status: 404, msg: `Account does not exists with us` })
        // check if the right opt was supplied
        if (code !== findAccount.resetcode) return res.json({ status: 404, msg: 'Invalid code entered' })
        findAccount.resetcode = null
        await findAccount.save()

        return res.json({ status: 200 })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.ChangePasswordOnRequest = async (req, res) => {
    try {
        const { email, password, confirm_password } = req.body
        if (!email || !password || !confirm_password) return res.json({ status: 404, msg: 'Incomplete request found' })
        if (confirm_password !== password) return res.json({ status: 400, msg: 'Password(s) mismatched' })
        const findAccount = await User.findOne({ where: { email: email } })
        if (!findAccount) return res.json({ status: 404, msg: `Account does not exists with us` })
        findAccount.password = password
        await findAccount.save()

        return res.json({ status: 200, msg: 'Password changed successfully' })
    } catch (error) {
        ServerError(res, error)
    }
}




exports.TestEmailing = async (req, res) => {
    try {
        await sendMail({ from: 'jagaban@gmail.com', subject: 'testing dynamic options', to: 'liteb237@gmail.com' })
        return res.json({ status: 200, msg: 'sent' })
    } catch (error) {
        ServerError(res, error)
    }
}