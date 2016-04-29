const caption = document.querySelector('#upload #upload-files span')
document.querySelector('#upload #upload-files input')
.addEventListener('change', (e) => {
	const files = Array.from(e.target.files)
	if (files.length === 0) caption.innerHTML = 'select files'
	else caption.innerHTML = files.map((f) => f.name).join(', ')
})
