import * as React from 'react';
import formatDate from "../utilities/formatDate";
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function ConvList(props) {

    // if there are no messages yet (user have chosen a recepient without sending any message yet)
    let createdAt = formatDate(new Date())
    let subContent = ''

    // if there is a message in the conversation then show the content and the date of the last message
    if (props.conv.messages.length != 0) {
        const lastMessage = props.conv.messages[props.conv.messages.length - 1]
        createdAt = formatDate(lastMessage.createdAt)
        const endPoint = lastMessage.message.length - 1 < 20 ? lastMessage.message.length : 20
        subContent = lastMessage.message.slice(0, endPoint)
    }


    // the recepient is the not logged in user
    const [recepient] = props.conv.members.filter((m) => m._id != props.loggedInUser._id)

    // if the convBar is clicked, then show the conversation in the conversationComponent
    const updateConvToShow = () => {
        props.updateConvToShow(props.conv._id)
    }

    return (<div onClick={updateConvToShow}>
        <ListItem alignItems="flex-start" sx={{bgcolor: '#f4f6f9',
                                                maxWidth: '100%',
                                                '&$selected': {backgroundColor: "white"},
                                                '&:hover': {backgroundColor: "#d9dcf5"},
                                                }}>
            <ListItemAvatar>
                <Avatar alt={recepient.firstName} src="/user-icon.png" />
            </ListItemAvatar>
            <ListItemText
                primary={recepient.firstName + " " + recepient.lastName}
                secondary={
                    <React.Fragment>
                        {subContent + '...  '+createdAt}
                    </React.Fragment>
                }
            />
        </ListItem>
        <Divider variant="middle" component="li" />
        </div>)
}