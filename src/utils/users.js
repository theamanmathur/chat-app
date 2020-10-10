/*jshint esversion: 6 */
/*jshint esversion: 7 */
/*jshint esversion: 8 */
/* jshint -W097 */
/* jshint -W117 */
'use strict';

const users = [];

//addUser,removeUser, getUser, getUsersInRoom

const addUser = ({
    id,
    username,
    room
}) => {

    //cleaning the data
    username = username.trim().toLowerCase();
    room = room.trim().toUpperCase();

    //validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required!'
        };
    }

    //checking for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    //validating username
    if (existingUser) {
        return {
            error: 'username is in use!!'
        };
    }

    //Storing user
    const user = {
        id,
        username,
        room
    };
    users.push(user);
    return {
        user
    };
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id); //better than filter function.

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

//Getting User
const getUser = (id) => {
    return users.find(user => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};

/*addUser({
    id:1,
    username:'amanmathur',
    room:'chase'
});

addUser({
    id:2,
    username:'theamanmathur',
    room:'chase'
});

addUser({
    id:3,
    username:'aman-mathur',
    room:'hunt'
});

console.log(getUser(2));

console.log(getUsersInRoom('chase'));

console.log(getUsersInRoom('hu'));

console.log(removeUser(1));*/