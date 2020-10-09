const users = [];

//join user to chat
function userJoin(id, username, room){

    const user = {id, username, room};

    users.push(user);

    return user;
}

//get current user details
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//when user Leave the room
function userLeave(id){
    const index = users.findIndex( user => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//get room user List
function getRoomUserList(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUserList
};