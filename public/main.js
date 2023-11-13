const socket = io();

const totalClients = document.getElementById('client-total');
const messageContainer = document.getElementById('messages-body');
const userName = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messageTone = new Audio('message-tone.mp3');

messageForm.addEventListener('submit', (e)=>{
     e.preventDefault();
     onMessageSend();
})

socket.on('clients-total', data => {
     totalClients.innerText = `Clients Total : ${data}`;
})

function onMessageSend(){
    if(messageInput.value === '') return;
     const data = {
          user: userName.value,
          message: messageInput.value,
          dateTime: new Date()
     }

     addMessageUI(true, data);
     socket.emit('message', data);
     messageInput.value = '';
}

socket.on('chat-message', data =>{
     console.log(data);
     messageTone.play();
     addMessageUI(false, data)
})

function addMessageUI( isOwnMessaage, data){
      const element = `
      <li class=${isOwnMessaage?"message-right":"message-left"}>
       ${data.message}
      <span class="stamp">${data.user} ○ ${moment(data.dateTime).fromNow()} </span>
 </li>
      `;
      messageContainer.innerHTML += element;
}

messageInput.addEventListener('focus', () => {
     const data = userName.value;
   sendFeedback(data);
});


messageInput.addEventListener('keydown', () => {
     const data = userName.value;
    sendFeedback(data);
 });
 
messageInput.addEventListener('blur', () => {
     const data = userName.value;
    sendFeedback(data);
 });

function sendFeedback(data){
     socket.emit('feedback', data);
}

socket.on('feedback', (data) =>{
     clearFeedback();
     console.log(data);
     const element = `
     <li class="feedback">
     ${data} is ✍️ typing somthing...
   </li>
     `;

     messageContainer.innerHTML += element;

})

function clearFeedback(){
     document.querySelectorAll('li.feedback').forEach(element => 
          element.parentNode.removeChild(element))
}