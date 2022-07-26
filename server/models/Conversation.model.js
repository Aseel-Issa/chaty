const mongoose = require('mongoose')
const Schema = mongoose.Schema

// message subschema, Will not be represented as a seperate collection in db
const MessageSchema = new Schema({
      message: {type: String},
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "each message should have a sender"]
      }
}, { _id : false, timestamps: { createdAt: true, updatedAt: false }})
// member subschema, Will not be represented as a seperate collection in db
const MemberSchema = new Schema({
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "Members should be registered on our system"]
    }
}, { _id : false })
// conversation representation in database
const ConversationSchema = new Schema({
    members: [MemberSchema],
    messages: [MessageSchema]
  }, { timestamps: true })

  // we only create and export the conversation model so it is the only allowed schema to be represented in db
const ConversationModel = mongoose.model('Conversation', ConversationSchema)

const save = async function (convObj) {
  try {
    const conv = new ConversationModel(convObj)
    await conv.save()
    const response = await conv.populate('members.member', 'firstName lastName')
    return response
  } catch (e) {
    return e.toString()
  }

}

const find = async function (convObj) {
  try {
    // get the firstName, and lastName fields of each member in conversation
    const response = await ConversationModel.find(convObj).populate('members.member', 'firstName lastName').sort({updatedAt: 'desc'})
    return response
  } catch (e) {
    return e.toString()
  }
}

const findOne = async function (convObj) {
  try {
     // get the firstName, and lastName fields of each member in conversation
    const response = await ConversationModel.findOne(convObj).populate('members.member', 'firstName lastName')
    return response
  } catch (e) {
    return e.toString()
  }
}

const pushMessage = async function (conv_id, message) {
  console.log('req body: ', message)
  return await ConversationModel.updateOne(
    { _id: conv_id }, 
    { $push: { messages: message } }
)
}

const pushMember = async function (conv_id, user) {
  ConversationModel.update(
    { _id: conv_id }, 
    { $push: { members: user } },
    done
)
}

const getMembersList = async function (conv_id){
  return ConversationModel.findOne({_id: conv_id}, {members: 1, _id: 0})
}

const findRawConversation = async function (conv_id){
  return ConversationModel.findOne({_id: conv_id})
}

module.exports = { save, find, pushMessage, pushMember, findOne, getMembersList, findRawConversation}