import NavBar from "./NavBar";
import ConvList from './ConvList'
import { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios'
import Conversation from '../classes/Conversation'
import Member from '../classes/Member';
import Message from '../classes/Message';
import ConversationComponent from './ConversationComponent'
import {SocketContext} from '../contexts/SocketContext'
const Base_Url = ''

export default function Home(props) {

    const socket = useContext(SocketContext);

    const [convs, setConvs] = useState([])
    const [convToShow, setConvToShow] = useState({})

    const loadConvs = async () => {
        let { data } = await axios.get(Base_Url + '/api/conversation/user/' + props.loggedInUser._id)
        let convsList = data.map((c) => {
            let members = c.members.map((m) => { return new Member(m.member._id, m.member.firstName, m.member.lastName) })
            let messages = c.messages.map((m) => { return new Message(m.message, m.sender, m.createdAt) })
            return new Conversation(c._id, members, messages)
        })
        setConvs(convsList)
        if (convsList.length > 0)
            setConvToShow(convsList[0])
    }

    // load all conversation of the logged in user from server
    useEffect(() => {
        loadConvs()
    }, [])

    useEffect(() => {
        if(socket == null) {
            return
        }
        // newMessage shall contain the conversation id, and the content of the message
        socket.on('recieve-new-message', data => {
        // add the recieved message to the end of the messages list of related conversation
          let index = convs.findIndex(c => {return c._id == data.conv_id})
          if(index != -1){
            let newConv = {...convs[index]}
            newConv.messages.push(new Message(data.newMessage.message, data.newMessage.sender, data.newMessage.createdAt))
            let newList = [...convs]
            // move the conversation to the top
            newList.splice(index,1)
            newList.unshift(newConv)
            setConvs(newList)
          }else{
              console.log('conv was not found...')
          }
        });

         // recieves a conversation document
         socket.on('recieve-new-conversation', data => {
          try{
            let members = data.members.map((m) => { return new Member(m.member._id, m.member.firstName, m.member.lastName) })
            let messages = data.messages.map((m) => { return new Message(m.message, m.sender, m.createdAt) })
            let newConv = new Conversation(data._id, members, messages)
            let newList = [...convs]
            // add the conversation to the top
            newList.unshift(newConv)
            setConvs(newList)
          }catch(e){
              console.log(e)
          }
        });

        // turn events off when the component is unmounting
        return () => {
            socket.off('recieve-new-message')
            socket.off('recieve-new-conversation')
        }
    }, [socket, convs])

    const updateConvToShow = (id) => {
                // change conv to show
            let [conv] = convs.filter(c => { return c._id == id })
            setConvToShow(conv)
    }

    const addConv = async (conv) => {
        let newList = [...convs]
        newList.unshift(conv)
        await setConvs(newList)
    }

    // special case (when the user is starting a new conversation)
    // TODO -  (usecase) check when the user is starting a new conversation, and then recieves a new message from another conversation
    useEffect(()=>{
        if(convs.length >0 ){
            if(convs[0]._id == ''){
                updateConvToShow(convs[0]._id)
            }
        }
    }, [convs])

    const addMessage = (convId, message) => {
        let newList = [...convs]
        let index = newList.findIndex((c) => {return c._id == convId})
        let newConv = {...convs[index]}
        newConv.messages.push(new Message(message.message, message.sender, new Date()))
        newList.splice(index, 1)
        newList.unshift(newConv)
        setConvs(newList)
    }

    const updateUnsavedConv = (newConv) => {
        let newList = [...convs]
        let index = newList.findIndex((c) => {return c._id == ''})
        let members = newConv.members.map((m) => { return new Member(m.member._id, m.member.firstName, m.member.lastName) })
        let messages = newConv.messages.map((m) => { return new Message(m.message, m.sender, m.createdAt) })
        newList[index] = new Conversation(newConv._id, members, messages)
        setConvs(newList)
        // update conv to show
        setConvToShow(newList[index])
    }

    return (<div>
        <div className='conv-container'>
            <NavBar logout={props.logout}></NavBar>
            <ConvList loggedInUser={props.loggedInUser} convs={convs} updateConvToShow={updateConvToShow} addConv={addConv}></ConvList>
            <ConversationComponent loggedInUser={props.loggedInUser} conv={convToShow} addMessage={addMessage} updateUnsavedConv={updateUnsavedConv}></ConversationComponent>
        </div>
    </div>)
}