'use strict'

const depth    = require('path-depth')
const path     = require('path')
const url      = require('url')
const Koa      = require('koa')
const route    = require('koa-route')

const upload   = require('./upload')
const remove   = require('./remove')
const frontend = require('./frontend')
const download = require('koa-serve-static')



const pre = (_, next) => {
	if (depth(path.relative('/', _.path)) < 0) {
		_.status = 403
		_.body = 'Path outside of served directory.'
	} else {
		_.path = './' + url.parse(_.req.url).pathname
		_.dir  = path.join(_.root, _.path)
		next()
	}
}

const casket = (opt) => {
	const app = new Koa()
	Object.assign(app.context, opt)
	return app.use(pre)

	.use(route.post('*',   upload(opt.root)))
	.use(route.delete('*', remove))
	.use(route.get('*',    frontend))
	.use(route.get('*',    download(opt.root)))
}

module.exports = casket
