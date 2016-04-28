'use strict'

const so      = require('so')
const accepts = require('accepts')
const path    = require('path')
const url     = require('url')

const ui      = require('./ui')
const serve   = require('./serve')



const casket = (base) => so(function* (ctx) {
	ctx.path = path.relative('/', url.parse(ctx.req.url).pathname)
	ctx.path = path.join(base, ctx.path)

	const mime = accepts(ctx.request).type('html', 'json')
	if (mime === 'html') yield ui(ctx)
	else serve(ctx)
})

module.exports = casket
