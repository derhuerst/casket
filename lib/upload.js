'use strict'

const multer   = require('multer')

const upload = (root) => {
	const receive = multer({
		storage: multer.diskStorage({
			destination: (req, file, cb) => cb(null, req.absolute),
			filename: (req, file, cb) => cb(null, file.originalname)
		})
	})
	.array('files')
	return (req, res) =>
		receive(req, res, (err) =>
			res.redirect(req.headers.referer || '/'))
}

module.exports = upload
