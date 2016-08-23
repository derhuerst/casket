'use strict'

const rimraf = require('rimraf')

const remove = (req, res) => {
	if (!req.app.locals.readonly)
		return res.status(403).end('readonly mode.')
	rimraf(req.absolute, (err) => {
		if (err) res
			.status(err.code === 'ENOENT' ? 404 : 500)
			.end(err.message)
		else res.status(200).end('Ok.')
	})
}

module.exports = remove
