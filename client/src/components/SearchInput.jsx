// import AddBoxIcon from '@mui/icons-material/AddBox';
import { useState, useEffect } from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import Conversation from '../classes/Conversation';
// import User from '../classes/User';
import Member from '../classes/Member';

const Base_Url = ''
export default function SearchInput(props) {

    const color = '#ea4b4b'
    const [users, setUsers] = useState([])
    const [searchString, setSearchString] = useState('')
    const [selectedUser, setSelectedUser] = useState({})

    const inputHandler = (e) => {
        setSearchString(e.target.value)
    }

    const handleOption = (e, value) => {
        setSelectedUser(value)
    }

    // get all users that includes the searchstring
    const loadUsersList = async () => {
        if (searchString == "") return
        let { data } = await axios.get(Base_Url + '/api/users/' + props.loggedInUser._id + '/' + searchString)
        setUsers(data)
    }

    // update which conversation to view based on the chosen recepient (selectedUser)
    useEffect(() => {
        // check if it is the empty object (initial value) or user didn't select one yet
        if (selectedUser == undefined || selectedUser == null || Object.keys(selectedUser).length == 0) return
        // create new conversation front end only
        let list = props.convList.map((c) => {
            if (c.members.filter(m => { return m._id == selectedUser._id }).length == 0) {
               
            }
            else {
                // open exiting one
                console.log('existed conv should be opened')
                return c
            }
        })
        // console.log('list: ', list)
        if(list.every((l) => { return l == undefined})){
            // console.log('new conversation should be created')
                let sender = new Member(props.loggedInUser._id, props.loggedInUser.firstName, props.loggedInUser.lastName)
                let newConv = new Conversation('', [sender, new Member(selectedUser._id, selectedUser.firstName, selectedUser.lastName)], [])
                props.addConv(newConv)
        }else{
            let [newConv] = list.filter((l) => {return l !=undefined})
            props.updateConvToShow(newConv._id)
        }
        
    }, [selectedUser])

    // whenever user types a charachter, the client loads users from server
    useEffect(() => { loadUsersList() }, [searchString])

    return (
        <div id='search-component'>
            <Autocomplete className='autocomplete'
                id="search-list"
                onChange={handleOption}
                sx={{ width: '95%' }}
                options={users}
                autoHighlight
                getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        {option.firstName} {option.lastName}
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField sx={{ bgcolor: 'white' }} onChange={inputHandler}
                        {...params}
                        label="Type recepient name"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
            />
        </div>
    )

}