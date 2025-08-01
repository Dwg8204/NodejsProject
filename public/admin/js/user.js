const btnAddFriend = document.querySelectorAll('button[btn-add-friend]');
btnAddFriend.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const userId = btn.getAttribute('btn-add-friend');
        btn.style.display = 'none';
        const btnCancel = document.querySelector(`button[btn-cancel-friend="${userId}"]`);
        if (btnCancel) {
            btnCancel.style.display = 'inline-block';
        }
        socket.emit('CLIENT_ADD_FRIEND', userId);
    });
});