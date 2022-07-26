
// track logged in users and their sockets

let users = {}

function addUser(userId, socket){
    users[userId] = socket
}

function removeUser(userId){
    return delete users[userId]
}

function getUserSocket(userId){
    if(users.hasOwnProperty(userId))
        return users[userId]
    else
        return undefined
}

function printAllActiveUsers(){
    console.log('active users: ', users)
}

module.exports={
    addUser, removeUser, getUserSocket, printAllActiveUsers
}