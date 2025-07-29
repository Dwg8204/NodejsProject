const formSendData = document.querySelector('.inner-form');
if(formSendData) {
    formSendData.addEventListener('submit', function(event) {
        event.preventDefault();
        const content = event.target.elements.content.value;
        console.log(content);
        if (content){
            socket.emit('CLIENT_SEND_MESSAGE', content);
            event.target.elements.content.value = ''; 
        }
    });
}
else {
    console.error('Form with class "inner-form" not found.');
}