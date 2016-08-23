'use strict'

const fs      = require('fs-promise')
const co      = require('co-express')
const path    = require('path')
const accepts = require('accepts')

const ui      = require('./ui')



const isDir = (dir) => fs.stat(dir).then((s) => s.isDirectory())

const frontend = co(function* (req, res, next) {
	if (!(yield isDir(req.absolute))) return next()
	if (accepts(req).type('html') !== 'html') return next()

	const content = yield fs.readdir(req.absolute)

	const breadcrumb = [{
		  name: req.app.locals.name
		, path: '/'
	}].concat(req.relative.split(path.sep)
		.filter((segment) => segment.length > 0)
		.map((segment, i, all) => ({
			  name: segment
			, path: '/' + all.slice(0, i + 1).join(path.sep)
		})))

	let files = content
		.map((name) => ({name, path: '/' + path.join(req.relative, name)}))
	if ('function' === typeof req.app.locals.filter)
		files = files.filter(req.app.locals.filter)
	for (let file of files) {
		const stat = yield fs.stat(path.join(req.app.locals.root, file.path))
		file.isDir = stat.isDirectory()
		file.size = stat.size
	}

	res.status(200).type('html')
	.end(ui({
		  name: req.app.locals.name
		, path: req.relative
		, breadcrumb, files
	}))
})

module.exports = frontend
