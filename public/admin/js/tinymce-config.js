document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('textarea#description')) {
    tinymce.init({
      selector: 'textarea',
      height: 300,
      plugins: 'lists link image code',
      toolbar: 'undo redo | bold italic | bullist numlist | link image | code',
      menubar: false
    });
  }
});