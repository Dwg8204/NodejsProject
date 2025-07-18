// Form dropSearchIndex
const formSearch = document.querySelector('#form-search');
if (formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener('submit', (e)=>{
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        // Lấy giá trị nhập vào ô tìm kiếm
        console.log(keyword);
        if(keyword){
            url.searchParams.set('keyword', keyword);

        }
        else{
            url.searchParams.delete('keyword');
        }
        window.location.href = url.href;
    })
}

// pagination 
document.querySelectorAll('.pagination .page-link').forEach(link => {
    // Lấy thông tin trang hiện tại, tổng số trang
    const url = new URL(window.location.href);
    const currentPage = parseInt(url.searchParams.get('page')) || 1;
    const totalPages = parseInt(link.getAttribute('data-total-pages')) || 1; // Thêm data-total-pages vào nút Next

    // Chỉ disable nút Previous
    if (link.textContent.trim() === 'Previous' && currentPage === 1) {
        link.parentElement.classList.add('disabled');
    }

    // Chỉ disable nút Next
    if (link.textContent.trim() === 'Next' && currentPage === totalPages) {
        link.parentElement.classList.add('disabled');
    }

    link.addEventListener('click', function(e) {
        if (this.parentElement.classList.contains('disabled')) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const page = this.getAttribute('data-page');
        if (!page) return;
        let url = new URL(window.location.href);
        url.searchParams.set('page', page);
        window.location.href = url.pathname + url.search;
    });
});


// upload image

const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImage.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            uploadImagePreview.style.display = 'block'; // Hiển thị ảnh xem trước
        } 
        const uploadImageRemove = uploadImage.querySelector('[upload-image-remove]');
        if (uploadImageRemove) {
            uploadImageRemove.style.display = 'block'; 
            uploadImageRemove.addEventListener('click', () => {
            uploadImageInput.value = ''; // Xoá giá trị input file
            uploadImagePreview.src = ''; // Xoá ảnh xem trước
            uploadImagePreview.style.display = 'none'; // Ẩn ảnh xem trước
            uploadImageRemove.style.display = 'none'; // Ẩn nút X
            
        });
        }
        
    });
    
    

}


// alert 
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[show-alert]').forEach(function(alert) {
        const time = parseInt(alert.getAttribute('data-time')) || 0;
        if (time > 0) {
            setTimeout(() => {
                alert.style.display = 'none';
            }, time);
        }
        // Cho phép click vào dấu X để đóng ngay
        const closeBtn = alert.querySelector('[close-alert]');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                alert.style.display = 'none';
            });
        }
    });
});
