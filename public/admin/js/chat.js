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
            messageElement.innerHTML = `
                <div class="bg-primary text-white p-2 rounded shadow-sm ms-auto" style="max-width:70%">
                    <span>${data.content}</span>
                </div>
                <span class="me-2 align-self-end text-muted fs-7">${new Date(data.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            `;
        } else {
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
// scroll chat to bottom
window.addEventListener('DOMContentLoaded', function() {
    var chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
      

// document.querySelector('emoji-picker')
//   .addEventListener('emoji-click', event => console.log(event.detail));
const emojiPicker = document.querySelector('emoji-picker');
if (emojiPicker) {
    emojiPicker.style.display = 'none';
}

// Hiện/ẩn emoji-picker khi click icon
const emojiBtn = document.getElementById('emoji-btn');
if (emojiBtn && emojiPicker) {
    emojiBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        emojiPicker.style.display = (emojiPicker.style.display === 'none' || !emojiPicker.style.display) ? 'block' : 'none';
    });

    // Ẩn emoji-picker khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (!emojiPicker.contains(e.target) && e.target !== emojiBtn && !emojiBtn.contains(e.target)) {
            emojiPicker.style.display = 'none';
        }
    });

    // Thêm emoji vào input khi chọn
    emojiPicker.addEventListener('emoji-click', event => {
        const contentInput = document.querySelector('.inner-form input[name="content"]');
        if (contentInput) {
            contentInput.value += event.detail.unicode;
            contentInput.focus();
        }
        emojiPicker.style.display = 'none';
    });
}
// Gửi sự kiện typing khi người dùng nhập
const inputContent = document.querySelector('input[name="content"]');
if (inputContent) {
    let typingTimeout;
    inputContent.addEventListener('input', function() {
        socket.emit('TYPING', { userId: userId, opponentId: opponent.id });
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit('STOP_TYPING', { userId: userId, opponentId: opponent.id });
        }, 3000); 
    });
}

// Hiển thị trạng thái typing khi nhận được sự kiện
socket.on('TYPING', (data) => {
    if (data.userId !== userId) {
        document.getElementById('typing-status').innerText = `${opponent.fullName} đang nhập...`;
    }
});
socket.on('STOP_TYPING', (data) => {
    if (data.userId !== userId) {
        document.getElementById('typing-status').innerText = '';
    }
});