Array.from(document.querySelectorAll('#directory #files .file'))
.forEach(function (file) {
	var button = file.querySelector('.file-actions-airplay-button')
	var name = file.querySelector('.file-name a')
	var path = decodeURI(name.getAttribute('href'))

	button.addEventListener('click', function (e) {
		e.preventDefault()

		fetch('/airplay', {
			method: 'PATCH',
			headers: {'content-type': 'text/plain'},
			body: path
		})
		.then(function (res) {
			if (!res.ok) {
				var err = new Error(res.statusText)
				err.statusCode = res.status
				throw err
			}
			button.innerText = '✔︎'
		})
		.catch(function (err) {
			console.error(err)
			button.innerText = '✘'
		})
	})
})
