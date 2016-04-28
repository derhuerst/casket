// This is a workaround because browsers don't support sending DELETE requests using forms.
// See https://www.w3.org/Bugs/Public/show_bug.cgi?id=10671 and http://amundsen.com/examples/put-delete-forms/

Array.from(document.querySelectorAll('#directory #files .file'))
.forEach(function (file) {
	var form = file.querySelector('.file-actions-delete')
	var button = file.querySelector('.file-actions-delete-button')
	form.addEventListener('submit', function (e) {
		e.preventDefault()
		fetch(form.getAttribute('action'), {method: form.getAttribute('method')})
		.catch(function () {button.setAttribute('value', '❌')})
		.then(function () {file.parentNode.removeChild(file)})
	})
})
