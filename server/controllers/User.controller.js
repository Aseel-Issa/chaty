const User = require('../models/User.model')

  // create user through API route
 const create = async function (req, res) {
    try {
      const response = await User.save(req.body)
      res.send(response)
    } catch (e) {
        res.status(400).send(new Error('User document was not saved to database'))
        console.log(e.toString())
    }
  
  }

  // create user to db
 const createUser = async function (user){
    return await User.save(user)
 }
  
  const findById = async function (req, res) {
    try {
      const response = await User.findOne({_id: req.params.id})
      res.send(response)
    } catch (e) {
        res.status(400).send(new Error('Could not search on user by his id'))
        console.log(e.toString())
    }
  }

  const findByEmail = async function (req, res) {
    try {
      const response = await User.findOne({email: req.params.email})
      res.send(response)
    } catch (e) {
        res.status(400).send(new Error('Could not search on user by his email'))
        console.log(e.toString())
    }
  }

  // get all users based on a search string, excluding the user who has the id passed in route
  const findAll = async function (req, res) {
    try {
      const response = await User.find(
        {
          $and:[
            {_id: { $nin: [req.params.id] }},
            {$or: [
              {firstName: { "$regex": req.params.searchString, "$options": "i" }},
              {lastName: { "$regex": req.params.searchString, "$options": "i" }}
            ]}
          ]
        }
        )
        let minimisedList = response.map((user)=>{return {_id: user._id, firstName: user.firstName, lastName: user.lastName}})
      res.send(minimisedList)
    } catch (e) {
        res.status(400).send(new Error('Could not get users list'))
        console.log(e.toString())
    }
  }

  const findUserByEmail = async function (email){
      const response = await User.findOne({email: email})
      return response
  }
  
  module.exports = { create, findById, findByEmail, createUser, findUserByEmail, findAll }