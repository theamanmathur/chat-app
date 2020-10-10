/*jshint esversion: 6 */
/*jshint esversion: 7 */
/*jshint esversion: 8 */
/* jshint -W097 */
/* jshint -W117 */
'use strict';

const socket = io();

//Elements
const $messageForm = document.querySelector('#msg-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#sendLoc');
const $messages = document.querySelector('#messages');

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const autoscroll = () => {

    const $newMessage = $messages.lastElementChild;

    //height of the new/last message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    //visible height
    const visibleHeight = $messages.offsetHeight;

    //height of messages container
    const containerHeight = $messages.scrollHeight;

    //How far scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight-newMessageHeight<=scrollOffset){
        $messages.scrollTop=$messages.scrollHeight;
    }
};

//listen to message event
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (locationLink) => {
    //console.log(message);

    const html = Mustache.render(locationMessageTemplate, {
        username: locationLink.username,
        locationLink: locationLink.url,
        createdAt: moment(locationLink.createdAt).format('HH:mm A')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');
    //disable

    //const msg=document.querySelector('input').value;
    //alternative and recommended way below
    const msg = e.target.elements.message.value;

    socket.emit('sendMsg', msg, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if (error) {
            return console.log(error);
        }
        console.log('message delivered!!');
    });
});


//Sharing Location
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser!!');
    }
    $sendLocationButton.setAttribute('disabled', 'disabled');
    //getcurrentposition does not support promises
    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position);
        const {
            latitude,
            longitude
        } = position.coords;
        const loc = {
            latitude,
            longitude
        };
        socket.emit('sendLoc', loc, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log("Server: location recieved!!");
        });
    });
});

socket.emit('join', {
    username,
    room
}, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});

//Roomdata event
socket.on('roomData', ({
    room,
    users
}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
});