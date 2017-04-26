'use strict'

const co = require('co-express')
const accepts = require('accepts')
const spotlight = require('node-spotlight')
const sink = require('stream-sink')
const path = require('path')

const fs = require('./fs')
const ui = require('./ui')
const breadcrumb = require('./breadcrumb')



const search = co(function* (req, res, next) {
	if (!req.query || !req.query.q) return next()
	if (!(yield fs.isDir(req.absolute))) return next()
	if (accepts(req).type('html') !== 'html') return next() // todo: support JSON & plain text

	let results = []
	try {
		results = yield spotlight(req.query.q, req.absolute).pipe(sink('object'))

		for (let result of results) {
			const stat = yield fs.stat(result.path)

			result.name = path.basename(result.path)
			result.path = '/' + path.relative(req.app.locals.root, result.path)
			result.isDir = stat.isDirectory()
			result.size = stat.size
		}
	} catch (err) {
		return res.status(500).end(err.message)
	}

	if ('function' === typeof req.app.locals.filter)
		results = results.filter(req.app.locals.filter)
	results = results.sort(fs.sortFiles)

	res.status(200).type('html')
	.end(ui({
		  name: req.app.locals.name
		, path: '/' + req.relative
		, readonly: req.app.locals.readonly
		, breadcrumb: breadcrumb(req.app.locals.name, req.relative)
		, files: results
	}))
})

module.exports = search
