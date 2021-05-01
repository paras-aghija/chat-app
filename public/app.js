const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login'}

// Chat Stuff

const chatWindow = document.getElementById('chat')
const messageList = document.getElementById('messagesList')
const messagesInput = document.getElementById('messagesInput')
const sendBtn = document.getElementById('sendBtn')
// Login Stuff
let username = ''
const usernameInput = document.getElementById('usernameInput')
const loginBtn = document.getElementById('loginBtn')
const loginWindow = document.getElementById('login')


const messages = []; // {author, date, content, type}

var socket = io()

socket.on('message', message => {
    console.log(message)
    if(message.type !== messageTypes.LOGIN){
        if(message.author === username){
            message.type = messageTypes.RIGHT
        }
        else{
            message.type = messageTypes.LEFT
        }
    }
    messages.push(message)
    displayMessages()
    messagesInput.value = ''
    chatWindow.scrollTop = chatWindow.scrollHeight;
})

const createMessageHTML = (message) => {
    if(message.type == messageTypes.LOGIN){
        return `<p class="secondary-text text-center mb-2">${message.author} joined the chat</p>`;
    }

    return `
        <div class="message ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}">
            <div class="message-details flex">
                <p class="flex-grow-1 message-author">${message.type === messageTypes.RIGHT ? '' : message.author}</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `
}

const displayMessages = () => {
    const messagesHTML = messages
        .map(message => createMessageHTML(message))
        .join('')

    messageList.innerHTML = messagesHTML
}

displayMessages()

// sendBtn callback

sendBtn.addEventListener('click', e => {
    e.preventDefault();

    if(!messagesInput.value){
        return console.log('Must supply a message')
    }
    const d = new Date();
    const message = {
        author: username,
        date: d.toLocaleDateString() + ' ' + d.toLocaleTimeString(),
        content: messagesInput.value,
    }

    sendMessage(message)
    
})

const sendMessage = message => {
    socket.emit('message', message)

}

// loginBtn callback

loginBtn.addEventListener('click', (e) => {
    // prevent default action of the form
    e.preventDefault();
    // set username and create logged in message
    if(!usernameInput.value){
        return console.log('Must supply username')
    }
    username = usernameInput.value;
    console.log(username)

   sendMessage({
        author: username,
        type: messageTypes.LOGIN
    })
    // hide login and show chat window
    loginWindow.classList.add('hidden')
    chatWindow.classList.remove('hidden')

    // display those messages
})