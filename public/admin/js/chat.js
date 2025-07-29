const userId = window.userId;
const opponent = window.opponent;

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector('.inner-form');
if(formSendData) {
    formSendData.addEventListener('submit', function(event) {
        event.preventDefault();
        const content = event.target.elements.content.value;
        console.log(content);
        console.log('userId:', userId, 'opponentId:', opponent.id);
        if (content){
            socket.emit('CLIENT_SEND_MESSAGE', {
                content: content,
                userId: userId,
                opponentId: opponent.id
            });
            event.target.elements.content.value = ''; 
        }
    });
}
else {
    console.error('Form with class "inner-form" not found.');
}

// SERVER_RETURN_MESSAGE
socket.on('SERVER_RETURN_MESSAGE', (data) => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('d-flex', 'mb-2');

        if (data.userId === userId) {
            // Tin nhắn của mình (bên phải, không avatar)
            messageElement.innerHTML = `
                <div class="bg-primary text-white p-2 rounded shadow-sm ms-auto" style="max-width:70%">
                    <span>${data.content}</span>
                </div>
                <span class="me-2 align-self-end text-muted fs-7">${new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            `;
        } else {
            // Tin nhắn đối phương (bên trái, có avatar)
            messageElement.innerHTML = `
                <img src="${opponent.avatar}" alt="${opponent.fullName}" width="30" height="30" class="rounded-circle me-2">
                <div class="bg-white p-2 rounded shadow-sm me-auto" style="max-width:70%">
                    <span class="text-dark">${data.content}</span>
                </div>
                <span class="ms-2 align-self-end text-muted fs-7">${new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            `;
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        console.error('Chat box with ID "chat-box" not found.');
    }
});
      

