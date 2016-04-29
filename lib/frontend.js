'use strict'

const so      = require('so')
const accepts = require('accepts')
const fs      = require('fs-promise')
const path    = require('path')

const ui      = require('./ui')



const isDir = (dir) => fs.stat(dir).then((s) => s.isDirectory())

const frontend = so(function* (_, next) {
	if (!(yield isDir(_.dir))) return next()
	if (accepts(_.req).type('html') !== 'html') return next()

	const content = yield fs.readdir(_.dir)

	const breadcrumb = [{name: _.name, path: '/'}]
	.concat(_.path.split(path.sep)
		.filter((segment) => segment.length > 0)
		.map((segment, i, all) => ({
			  name: segment
			, path: '/' + all.slice(0, i + 1).join(path.sep)
		})))

	const files = content
		.map((name) => ({name, path: '/' + path.join(_.path, name)}))

	_.type = 'text/html'
	_.body = ui({name: _.name, path: _.path, breadcrumb, files})
})

module.exports = frontend
