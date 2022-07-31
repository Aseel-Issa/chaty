import Message from "./Message";
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { useState, useRef, useEffect } from 'react'

export default function ConversationComponent(props) {
    
    const [newMessage, setNewMessage] = useState('')
    const bottomRef = useRef(null)
    const inputRef = useRef(null)

    const emtyConversation = (props.conv == undefined || props.conv == null || Object.keys(props.conv).length == 0)
    useEffect(() => {

        if (!emtyConversation){
            // 👇️ scroll to bottom every time messages change          
            if(bottomRef.current!=null){
                bottomRef.current.scrollIntoView({ block: "start"});
            }
            // focus the message input
            if(inputRef.current!=null){
                inputRef.current.focus()
            }
        }
    });

    // if the conversation has not been started yet, or if there are no conversations yet, show this page
    if (emtyConversation)
        return (<div>
            Start messaging your friends.
    </div>)

    let [loggedInUserId] = Object.values(props.loggedInUser)
    let counter = 0

    // the recepient of the message is the member that does not have the id of the logged in user
    const [recepient] = props.conv.members.filter(m => {
        return m._id != loggedInUserId
    })

    const sendMessage = async () => {
        // send request to server
        const message = {message: newMessage, sender: loggedInUserId}
        // if the user is starting a conversation (will create one)
        if(props.conv._id == ''){
            const members = props.conv.members
            let bodyConv = {members: [{member: members[0]._id}, {member: members[1]._id}], messages: [message]}
            let newConv = await axios.post('/api/conversation/new', bodyConv)
            // update client side
            props.updateUnsavedConv(newConv.data)
        }
        // if the user is sending a message to an existing conversation
        else{
            const newConv = await axios.put('/api/conversation/' + props.conv._id, message)
             // update client
            props.addMessage(props.conv._id, message)
        }
        
        setNewMessage('')
    }
    // creates a message component for each message in conversation
    let messages = props.conv.messages.map(m => { return <Message key={counter++} loggedInUserId={loggedInUserId} message={m}></Message> })
    return (
        <div className='conversation'>
            <div className='recepient'>{recepient.firstName} {recepient.lastName}</div>
            <hr></hr>
            <div className='content'>
                 {messages}
                <div ref={bottomRef} className='empty'></div>
            </div>
            <hr></hr>
            <div className='insert-message'>
                <TextField className='insert'
                    onChange={(e) => { setNewMessage(e.target.value) }}
                    value= {newMessage}
                    id="standard-textarea"
                    label="Your message here..."
                    placeholder="Type..."
                    multiline
                    variant="standard"
                    inputRef={inputRef}
                />
                <SendIcon className='sendIcon'
                    onClick={sendMessage}
                    fontSize="large"
                    sx={{ bgcolor: '#ea4b4b', color: 'white' }}>
                </SendIcon>
            </div>
        </div>
    )
}