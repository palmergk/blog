// Load environment variables from a .env file
require('dotenv').config()

// Import necessary libraries and modules
const express = require('express')
const http = require('http')
const fileUpload = require('express-fileupload')
const cors = require('cors')

// Initialize an Express application
const app = express()

// Set the port for the server to listen on (default is 5000)
const port = process.env.PORT || 5000

// Create an HTTP server using the Express application
const server = http.createServer(app)

// Configure CORS for the server, allowing requests from http://localhost:5173
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174']
}))

// Parse incoming JSON requests 
app.use(express.json())

// Enable file uploads in the server
app.use(fileUpload())

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Use the 'userRoute' module for handling routes under the '/api/user' path
app.use('/api/user', require('./routes/userRoute'))
app.use('/api/blog', require('./routes/blogRoute'))

// Start the server and listen for incoming requests
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))

//Loading Environment Variables: It loads environment variables from a .env file using the dotenv library.
//Importing Libraries: It imports necessary libraries such as express, http, express-fileupload, and cors.
//Express App Initialization: It initializes an Express application.
//Port Configuration: It sets the port for the server to listen on, either from the environment variable or the default port 5000.
//HTTP Server Creation: It creates an HTTP server using the Express application.
//CORS Configuration: It configures CORS (Cross-Origin Resource Sharing) to allow requests only from 'http://localhost:5173'.
//JSON Parsing Middleware: It includes middleware to parse incoming JSON requests.
//File Upload Middleware: It enables file uploads in the server using the express-fileupload middleware.
//Static File Serving: It serves static files from the 'public' directory.
//Routing Middleware: It uses the 'userRoute' module to handle routes under the '/api/user' path.
//Server Start: It starts the server and logs a message indicating the server is running on a specific port.