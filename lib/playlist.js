'use strict'

const co = require('co-express')
const path = require('path')
const url = require('url')
const m3uWriter = require('m3u').writer

const fs = require('./fs')

const playlist = co(function* (req, res, next) {
	if (!(yield fs.isDir(req.absolute))) return next()
	if (!req.query || req.query.playlist !== 'true') return next()

	let files = (yield fs.readDir(req.absolute))
	.map((name) => ({name, path: '/' + path.join(req.relative, name)}))

	for (let file of files) {
		const stat = yield fs.stat(path.join(req.app.locals.root, file.path))
		file.isDir = stat.isDirectory()
		file.size = stat.size
	}

	if (req.app.locals.filter) files = files.filter(req.app.locals.filter)
	files = files.sort(fs.sortFiles)

	const playlist = m3uWriter()
	for (let file of files) {
		const link = url.format({
			protocol: req.get('x-forwarded-proto') || req.protocol,
			host: req.get('host'),
			pathname: encodeURI(file.path.slice(1))
		})
		playlist.file(link)
	}

	res.status(200)
	.type('application/vnd.apple.mpegurl')
	.end(playlist.toString())
})

module.exports = playlist
