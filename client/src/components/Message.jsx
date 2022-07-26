import formatDate from '../utilities/formatDate'

export default function Message(props){

    const userMessage = 'user-message'
    const recepientMessage = 'recepient-message'
    const createdAt =  formatDate(props.message.createdAt)
    let assignedClass
    // determine the right css based on the sender of the message (wether is the user or the recepient)
    if(props.loggedInUserId == props.message.sender)
        assignedClass = userMessage
    else
        {assignedClass = recepientMessage
        }

    return (
        <div className={'message '+ assignedClass}>
            <div className={'text'}><p>{props.message.message}</p></div>
            <div className={'date'}>{createdAt}</div>
        </div>
    )
}