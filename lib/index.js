'use strict'

const path = require('path')
const url = require('url')
const qs = require('querystring')
const depth = require('path-depth')
const express = require('express')
const compress = require('compression')
const favicon = require('express-favicon')

const upload = require('./upload')
const remove = require('./remove')
const playlist = require('./playlist')
const frontend = require('./frontend')
const download = require('./download')
const search = require('./search')



const defaults = {
	name: 'casket',
	root: process.cwd(),
	readonly: false,
	filter: (file) => file.name[0] !== '.'
}

const casket = (opt) => {
	const app = express()
	app.use(favicon(path.join(__dirname, '../favicon.png')))
	app.use(compress())

	Object.assign(app.locals, defaults, opt)

	app.use((req, res, next) => {
		const pathname = qs.unescape(url.parse(req.url).pathname)
		req.relative = path.relative('/', pathname)
		if (depth(req.relative) < 0) return req
			.status(403).end('Outside of served directory.')
		req.absolute = path.join(req.app.locals.root, req.relative)
		next()
	})

	if (!app.locals.readonly) {
		app.post('*', upload(opt.root))
		app.delete('*', remove)
	}
	app.get('*', playlist)
	app.get('*', search)
	app.get('*', frontend)
	app.get('*', download(opt.root))

	return app
}

module.exports = casket
