function changeStatus(element) {
    if (!confirm('Bạn có chắc muốn chuyển trạng thái?')) return;
    const id = element.getAttribute('data-id');
    const status = element.getAttribute('data-status');
    // Tạo form ẩn để gửi PATCH qua query string
    const form = document.createElement('form');
    form.action = `/admin/products/change-status/${status}/${id}?_method=PATCH`;
    form.method = 'POST';
    form.style.display = 'none';

    // Không cần input hidden _method
    document.body.appendChild(form);
    form.submit();
}

function toggleAllCheckboxes(source) {
    const checkboxes = document.querySelectorAll('input[name="ids[]"]');
    for (const cb of checkboxes) {
        cb.checked = source.checked;
    }
}
document.querySelectorAll('input[name="ids[]"]').forEach(cb => {
    cb.addEventListener('change', function() {
        if (!this.checked) {
            const checkAll = document.getElementById('check-all');
            if (checkAll) checkAll.checked = false;
        } else {
            // Nếu tất cả đều được tích thì "chọn tất cả" cũng tích
            const checkboxes = document.querySelectorAll('input[name="ids[]"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const checkAll = document.getElementById('check-all');
            if (checkAll) checkAll.checked = allChecked;
        }
    });

});

// Xử lý form thay đổi trạng thái nhiều sản phẩm
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    // Lấy select box chọn hành động
    const typeSelect = formChangeMulti.querySelector('select[name="type"]');
    
    formChangeMulti.addEventListener('submit', function(event) {
        event.preventDefault();
        const checkboxes = document.querySelectorAll('input[name="ids[]"]:checked');
        const type = typeSelect.value;
        if (checkboxes.length === 0) {
            event.preventDefault();
            alert('Vui lòng chọn ít nhất một sản phẩm để thay đổi trạng thái.');
        } 
        if (!type) {
            alert('Vui lòng chọn hành động (Kích hoạt/Ẩn/Xoá)!');
            return;
        }
        if (type === 'delete') {
            // Hành động xoá
            if (confirm('Bạn có chắc muốn XOÁ các sản phẩm đã chọn?')) {
                formChangeMulti.action = '/admin/products/delete-multi?_method=DELETE';
                formChangeMulti.submit();
            }
        } 
        else if (type === 'change-position') {
            // Hành động thay đổi vị trí
            if (confirm('Bạn có chắc muốn THAY ĐỔI VỊ TRÍ các sản phẩm đã chọn?')) {
                const selectedCheckboxes = document.querySelectorAll('input[name="ids[]"]:checked');
                const positionData = [];
                
                // Thu thập thông tin id và position
                selectedCheckboxes.forEach(checkbox => {
                    const productId = checkbox.value;
                    // Tìm input position tương ứng với id này
                    const positionInput = document.querySelector(`input[name="position"][data-id="${productId}"]`);
                    if (positionInput) {
                        const position = positionInput.value;
                        // Tạo chuỗi "id-position"
                        positionData.push(`${productId}-${position}`);
                    }
                });
                
                // Thêm dữ liệu vào form trước khi submit
                let positionInput = formChangeMulti.querySelector('input[name="positions"]');
                if (!positionInput) {
                    positionInput = document.createElement('input');
                    positionInput.type = 'hidden';
                    positionInput.name = 'positions';
                    formChangeMulti.appendChild(positionInput);
                }
                positionInput.value = positionData.join(',');
                
                formChangeMulti.action = '/admin/products/change-position';
                formChangeMulti.submit();
            }
        }
        else {
            // Hành động thay đổi trạng thái
            if (confirm('Bạn có chắc muốn thay đổi TRẠNG THÁI các sản phẩm đã chọn?')) {
                formChangeMulti.action = '/admin/products/change-multi?_method=PATCH';
                formChangeMulti.submit();
            }
        }
    });
} else {
    console.error('Form not found');
}


document.addEventListener('DOMContentLoaded', function() {
  const clearBtn = document.getElementById('sort-clear');
  const sortSelect = document.getElementById('sort');
  const sortForm = document.getElementById('sort-form');
  if (clearBtn && sortSelect && sortForm) {
    clearBtn.addEventListener('click', function() {
      sortSelect.value = '';
      sortForm.submit();
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var sortSelect = document.querySelector('[sort-select]');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      // Tìm form cha gần nhất và submit
      var form = sortSelect.closest('form');
      if (form) form.submit();
    });
  }
});