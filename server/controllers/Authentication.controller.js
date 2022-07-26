const jwt = require("jsonwebtoken");
const { authenticate } = require('../config/jwt.config')
const bcrypt = require('bcrypt')
const User = require('./User.controller')

const generateUserToken = (userID) => {
    const payload = {
        id: userID
    };
       
    //using the SECRET_KEY from our .env file
    return jwt.sign(payload, process.env.SECRET_KEY);
}

// attach user, and token to response
const attachUserAndToken = (res, userToken, user) => {
    res
    .cookie("usertoken", userToken, {
        httpOnly: true
    })
    // return specific fields only
    .send({_id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email});
}
// logout
const logout = (function (req, res){
    res.clearCookie('usertoken');
    res.sendStatus(200);
})

// login
const login = (async function (req, res){
    const credentials = req.body
    const result = await User.findUserByEmail(credentials.email)
    if(result === null) {
        // email not found in users collection
        return res.sendStatus(400);
    }
 
    // if we made it this far, we found a user with this email address
    // compare the supplied password to the hashed password in the database
    const correctPassword = await bcrypt.compare(credentials.password, result.password);
 
    if(!correctPassword) {
        // password wasn't a match!
        return res.sendStatus(400);
    }
       
    //generate token for logged in user
    const userToken = generateUserToken(result._id)
    // send user's data and generated token to client
    attachUserAndToken(res, userToken, result)
})

// create new user and log him in to the app
const registerUser = (async function (req, res){
    const user = req.body
    const result = await User.createUser(user)
    console.log(result)
    //generate token for logged in user
    const userToken = generateUserToken(result._id)
    // send user's data and generated token to client
    attachUserAndToken(res, userToken, result)
    })

    module.exports = {registerUser, login, logout}