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
        const btnAccept = document.querySelector(`button[btn-accept-friend="${userId}"]`);
        if (btnAdd) {
            btnAdd.style.display = 'inline-block';

        }
        if (btnAccept) {
            btnAccept.style.display = 'none';
        }
        console.log(userId);
        console.log('Cancel friend request for user ID:', userId);
        // Gửi sự kiện hủy kết bạn đến server
        socket.emit('CLIENT_CANCEL_FRIEND', userId);
    });
});

const btnRefuseFriend = document.querySelectorAll('button[btn-refuse-friend]');
btnRefuseFriend.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const userId = btn.getAttribute('btn-refuse-friend');
        btn.style.display = 'none';
        const disabled = document.querySelector(`button[disabled]`);
        const btnAccept = document.querySelector(`button[btn-accept-friend="${userId}"]`);
        if (disabled) {
            disabled.style.display = 'inline-block';
        }
        if (btnAccept) {
            btnAccept.style.display = 'none';
        }
        console.log(userId);
        console.log('Refuse friend request for user ID:', userId);
        // Gửi sự kiện từ chối kết bạn đến server
        socket.emit('CLIENT_REFUSE_FRIEND', userId);
    });
});

const btnAcceptFriend = document.querySelectorAll('button[btn-accept-friend]');
btnAcceptFriend.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const userId = btn.getAttribute('btn-accept-friend');
        btn.style.display = 'none';
        const btnCancel = document.querySelector(`button[btn-refuse-friend="${userId}"]`);
        if (btnCancel) {
            btnCancel.style.display = 'none';
        }
        console.log(userId);
        console.log('Accept friend request for user ID:', userId);  
        // Gửi sự kiện chấp nhận kết bạn đến server
        socket.emit('CLIENT_ACCEPT_FRIEND', userId);
    });
});


const btnRemoveFriend = document.querySelectorAll('button[btn-remove-friend]');
btnRemoveFriend.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const userId = btn.getAttribute('btn-remove-friend');
        btn.style.display = 'none';
        const btnAdd = document.querySelector(`button[btn-add-friend="${userId}"]`);
        const btnCancel = document.querySelector(`button[btn-cancel-friend="${userId}"]`);
        if (btnAdd) {
            btnAdd.style.display = 'inline-block';
        }
        console.log(userId);
        console.log('Remove friend for user ID:', userId);
        // Gửi sự kiện xóa bạn bè đến server
        socket.emit('CLIENT_REMOVE_FRIEND', userId);
    });
});



//SERVER_RETURN_LENGTH_ACCEPT_FRIEND

socket.on('SERVER_RETURN_LENGTH_ACCEPT_FRIEND', function (data) {
    const badgeUserAccept = document.querySelector('span[badge-user-accept]');
    const userId = badgeUserAccept.getAttribute('badge-user-accept');
    if (userId === data.userId) {
        badgeUserAccept.innerHTML = data.lengthAcceptFriends;
    }

});

