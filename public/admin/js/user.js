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

const btnCancelFriend = document.querySelectorAll('button[btn-cancel-friend]');
btnCancelFriend.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const userId = btn.getAttribute('btn-cancel-friend');
        btn.style.display = 'none';
        const btnAdd = document.querySelector(`button[btn-add-friend="${userId}"]`);
        if (btnAdd) {
            btnAdd.style.display = 'inline-block';
        }
        console.log(userId);
        console.log('Cancel friend request for user ID:', userId);
        // Gửi sự kiện hủy kết bạn đến server
        socket.emit('CLIENT_CANCEL_FRIEND', userId);
    });
});