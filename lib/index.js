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
const frontend = require('./frontend')
const asMp3 = require('./as-mp3')
const toAirplay = require('./airplay')
const download = require('./download')
const search = require('./search')



const defaults = {
	name: 'casket',
	root: process.cwd(),
	readonly: false,
	noDelete: false,
	noUpload: false,
	filter: (file) => file.name[0] !== '.',
	search: search.supported,
	airplay: null
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
		if(!app.locals.noUpload) {
			app.post('*', upload(opt.root))
		}
		if(!app.locals.noDelete) {
			app.delete('*', remove)
		}
	}
	app.get('*', search)
	app.get('*', frontend)
	app.get('*', asMp3)
	if ('string' === typeof app.locals.airplay) {
		app.patch('/airplay', toAirplay(app.locals.airplay))
	}
	app.get('*', download(opt.root))

	app.use((err, req, res, next) => {
		console.error(err + '')
		if (!res.headersSent) {
			res.status(err.statusCode || 500).end(err + '')
		}
	})

	return app
}

module.exports = casket
