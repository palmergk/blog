const jwt = require('jsonwebtoken')
const User = require('../models').users

// Middleware to authenticate and authorize user requests
exports.UserMiddleware = async (req, res, next) => {
    try {
        // Extract Bearer Token from the Authorization header
        const tokenHeader = req.headers.authorization
        if (!tokenHeader) return res.status(403).send('Forbidden')

        // Extract the token from the Bearer Token header
        const token = tokenHeader.split(' ')[1]

        // Verify the JWT token using the secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json({ status: 404, msg: `Access denied` })

        // Find user in the database based on the verified user ID
        const findUser = await User.findOne({ where: { id: verified.id } })
        if (!findUser) return res.json({ status: 404, msg: `Invalid account` })

        // Check if the user has the 'user' role for authorized access
        if (findUser.role !== 'user') return res.json({ status: 404, msg: `Unauthorized Access` })

        // Attach the user ID to the request object for further processing
        req.user = findUser.id

        // Continue to the next middleware or route handler
        next()
    } catch (error) {
        // Handle errors during authentication and authorization
        return res.json({ status: 400, msg: error })
    }
}

//This middleware function is designed to be used as part of an Express.js application. It checks the Authorization header for a Bearer Token, verifies the token, retrieves the user information from the database, and ensures that the user has the 'user' role for authorized access. If all checks pass, it attaches the user ID to the request object and calls the next middleware or route handler in the chain.