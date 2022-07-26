const express = require('express')
const router = express.Router()
const UserController = require('../controllers/User.controller')
const ConvController = require('../controllers/Convorsation.controller')
const Auth = require('../controllers/Authentication.controller')
const { authenticate } = require('../config/jwt.config')

// a sanity check to make sure the server works
router.get('/api/sanity', function (request, response) {
    console.log("Ok!")
    response.send('Ok!')
})

// create new user
router.post('/api/user/new', Auth.registerUser)

// login
router.post('/api/login', Auth.login)

// logout
router.get('/api/logout', Auth.logout)

// find user by email
router.get('/api/user/email/:email', authenticate, UserController.findByEmail)

// create conversation
router.post('/api/conversation/new', ConvController.create)

// get conversation
router.get('/api/conversation/:id', ConvController.findById)

// get all conversations by one of its members
router.get('/api/conversation/user/:id', authenticate, ConvController.findByUserId)

// get all users except the logged in one taking into consideration the searchString
router.get('/api/users/:id/:searchString', authenticate, UserController.findAll)

// add new message to a conversation
router.put('/api/conversation/:id', authenticate, ConvController.addNewMessage)

module.exports = router;