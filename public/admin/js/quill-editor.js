document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('editor-container')) {
    var quill = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ]
      },
      placeholder: 'Nhập mô tả sản phẩm...'
    });
    
    var description = document.getElementById('description').value;
    if (description) {
      quill.root.innerHTML = description;
    }
    
    var forms = document.querySelectorAll('#form-create-product, #form-edit-product');
    forms.forEach(function(form) {
      if (form) {
        form.addEventListener('submit', function() {
          var description = document.getElementById('description');
          description.value = quill.root.innerHTML;
        });
      }
    });
  }
});