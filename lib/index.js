'use strict'

const so      = require('so')
const accepts = require('accepts')
const path    = require('path')
const url     = require('url')
const depth   = require('path-depth')
const fs      = require('fs-promise')

const ui      = require('./ui')
const serve   = require('./serve')



const casket = (base, name) => so(function* (ctx) {
	ctx.base = base
	ctx.name = name
	ctx.path = url.parse(ctx.req.url).pathname

	if (depth(path.relative('/', ctx.path)) < 0) {
		res.status = 403
		res.body = 'Path outside of served directory.'
		return
	}

	const dir = path.join(ctx.base, path.relative('/', ctx.path))
	const stats = yield fs.stat(dir)
	const mime = accepts(ctx.request).type('html', 'json')

	if (stats.isDirectory() && mime === 'html') yield ui(ctx, serve)
	else serve(ctx)
})

module.exports = casket
