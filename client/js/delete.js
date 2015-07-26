// This is an AJAX workaround because browsers don't support sending DELETE requests using forms.
// See https://www.w3.org/Bugs/Public/show_bug.cgi?id=10671 and http://amundsen.com/examples/put-delete-forms/

var deleteOnSubmit = function (file, form, button) {
	form.addEventListener('submit', function (event) {
		var caption = button.getAttribute('value');
		var request = new XMLHttpRequest();
		request.open(form.getAttribute('method'), form.getAttribute('action'));
		request.addEventListener('readystatechange', function () {
			if (request.readyState === 4) {
				file.parentNode.removeChild(file);
				button.setAttribute('value', caption);
				button.removeAttribute('disabled');
			}
			// todo: ajax failed
		});
		request.send();
		button.setAttribute('value', '…');
		button.setAttribute('disabled', 'disabled');
		event.preventDefault();
	});
};

var files = document.querySelectorAll('#directory #files .file');
var i, length;
for (i = 0, length = files.length; i < length; i++) {
	deleteOnSubmit(files[i], files[i].querySelector('.file-actions-delete'), files[i].querySelector('.file-actions-delete-button'))
}
