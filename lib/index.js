'use strict'

const so      = require('so')
const path    = require('path')
const url     = require('url')
const depth   = require('path-depth')
const fs      = require('fs-promise')
const accepts = require('accepts')
const serve   = require('koa-serve-static')

const remove  = require('./remove')
const ui      = require('./ui')



const casket = (base, name) => {
	const file = serve(base)
	return so(function* (_) {
		_.base = base
		_.name = name
		_.path = url.parse(_.req.url).pathname

		if (depth(path.relative('/', _.path)) < 0) {
			res.status = 403
			res.body = 'Path outside of served directory.'
			return
		}

		const dir = path.join(_.base, path.relative('/', _.path))
		const stats = yield fs.stat(dir)
		const mime = accepts(_.request).type('html', 'json')

		if (_.req.method === 'DELETE') yield remove(_)
		else if (stats.isDirectory() && mime === 'html') yield ui(_, serve)
		else file(_)
	})
}

module.exports = casket
