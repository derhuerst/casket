'use strict'

const path     = require('path')
const url      = require('url')
const depth    = require('path-depth')
const express  = require('express')
const compress = require('compression')

const upload   = require('./upload')
const remove   = require('./remove')
const frontend = require('./frontend')
const download = require('./download')



const defaults = {
	name: 'casket',
	root: process.cwd(),
	readonly: false,
	filter: (file) => file.name[0] !== '.'
}

const casket = (opt) => {
	const app = express()
	Object.assign(app.locals, defaults, opt)
	app.use((req, res, next) => {
		req.relative = path.relative('/', url.parse(req.url).pathname)
		if (depth(req.relative) < 0) return req
			.status(403).end('Outside of served directory.')
		req.absolute = path.join(req.app.locals.root, req.relative)
		next()
	})
	app.use(compress())

	app.post('*',   upload(opt.root))
	app.delete('*', remove)
	app.get('*',    frontend)
	app.get('*',    download(opt.root))
	return app
}

module.exports = casket
