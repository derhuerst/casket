'use strict'

const path    = require('path')
const accepts = require('accepts')

const fs = require('./fs')
const ui = require('./ui')
const breadcrumb = require('./breadcrumb')



const frontend = async (req, res, next) => {
	if (!(await fs.isDir(req.absolute))) return next()
	if (accepts(req).type('html') !== 'html') return next()

	let files = (await fs.readDir(req.absolute))
	.map((name) => ({
		name, path: '/' + path.join(req.relative, name)
	}))

	for (let file of files) {
		const stat = await fs.stat(path.join(req.app.locals.root, file.path))
		file.isDir = stat.isDirectory()
		file.size = stat.size
	}

	if ('function' === typeof req.app.locals.filter)
		files = files.filter(req.app.locals.filter)
	files = files.sort(fs.sortFiles)

	res.status(200).type('html')
	.end(ui({
		  name: req.app.locals.name
		, path: '/' + req.relative
		, readonly: req.app.locals.readonly
		, noDelete: req.app.locals.noDelete
		, noUpload: req.app.locals.noUpload
		, airplay: req.app.locals.airplay
		, search: req.app.locals.search
		, breadcrumb: breadcrumb(req.app.locals.name, req.relative)
		, files
	}))
}

module.exports = frontend
