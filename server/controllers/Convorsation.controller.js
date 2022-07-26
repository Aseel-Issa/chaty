const Conversation = require('../models/Conversation.model')

const create = async function (req, res) {
  // @Validation-check if the conversation has at least two distinct members
    try {
      const conv = await Conversation.save(req.body)
      res.send(conv)
      let activeUsers = req.app.get('activeUsers')
      // When we create a new conversation, there will be exactly one message atached to its sender
      let sender = conv.messages[0].sender
      conv.members.forEach(m => {
        // send the message to all members except the sender
        if(sender != m.member._id.toString()){
          // get user socket of the recepient
          let recepient = activeUsers.getUserSocket(m.member._id.toString())
          // if user is not active, then no need to emit the event
          if(recepient!= undefined){
            console.log('fire event')
            let socketId = recepient.id
            req.io.to(socketId).emit('recieve-new-conversation', conv)
          }
        }
      })
      
    } catch (e) {
        res.status(400).send(new Error('Conversation document was not saved to database'))
        console.log(e.toString())
    }
  
  }
  
  // find conversation by its _id
  const findById = async function (req, res) {
    try {
      const response = await Conversation.findOne({_id: req.params.id})
      res.send(response)
    } catch (e) {
        res.status(400).send(new Error('Could not search on conversation'))
        console.log(e.toString())
    }
  }

  // find all the conversations that the user is member of
  const findByUserId = async function (req, res) {
    try {
      const response = await Conversation.find({members: {member: req.params.id}})
      res.send(response)
    } catch (e) {
        res.status(400).send(new Error('Could not search on conversation by its member'))
        console.log(e.toString())
    }
  }

  const addNewMessage = async function(req, res){
      try{
        let response = await Conversation.pushMessage(req.params.id, req.body)
        res.send(response)
        // get the list of all active users
        let activeUsers = req.app.get('activeUsers')
        try{
          let conv = await Conversation.findRawConversation(req.params.id)
          conv.members.forEach(m => {
            // for all members except the sender of the new message
            if(req.body.sender != m.member.toString()){
              // get socket id of the recepient
              let recepient = activeUsers.getUserSocket(m.member.toString()).id
              let newMessage = conv.messages[conv.messages.length-1]
              req.io.to(recepient).emit('recieve-new-message', {conv_id: conv._id, newMessage})
            }
          })
        }catch(e){
          console.log(e)
        }
      }catch(e){
        res.status(400).send(new Error('Could not add message to conversation'))
        console.log(e.toString())
      }  
  }

  const addNewMember = async function(req, res) {
    try{
        let response = await Conversation.pushMember(req.params.id, req.body)
        res.send(response)
      }catch(e){
        res.status(400).send(new Error('Could not add user to conversation'))
        console.log(e.toString())
      } 
  }

  module.exports = { create, findById, addNewMessage, addNewMember, findByUserId}