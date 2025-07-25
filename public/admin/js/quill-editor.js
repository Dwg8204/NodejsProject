document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('editor-container')) {
    var quill = new Quill('#editor-container', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['link', 'blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }]
        ]
      }
    });
    
    // Lắng nghe tất cả các form có editor
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      if (form) {
        form.addEventListener('submit', function() {
          var description = document.getElementById('description');
          if (description) {
            description.value = quill.root.innerHTML;
            console.log("Đã cập nhật nội dung textarea:", description.value);
          }
        });
      }
    });
  }
});