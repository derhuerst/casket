'use strict'

const co = require('co-express')
const path = require('path')
const url = require('url')
const m3uWriter = require('m3u').extendedWriter
const duration = require('mp3-duration')

const fs = require('./fs')
const readID3Tags = require('./read-id3-tags')

const readDuration = (path) => {
	return new Promise((resolve, reject) => {
		duration(path, (err, duration) => {
			if (err) reject(err)
			else resolve(duration)
		})
	})
}

const playlist = co(function* (req, res, next) {
	if (!(yield fs.isDir(req.absolute))) return next()
	if (!req.query || req.query.playlist !== 'true') return next()

	let files = (yield fs.readDir(req.absolute))
	.map((name) => ({
		name,
		path: '/' + path.join(req.relative, name),
		absolute: path.join(req.app.locals.root, req.relative, name)
	}))

	for (let file of files) {
		const stat = yield fs.stat(file.absolute)
		file.isDir = stat.isDirectory()
		file.size = stat.size
	}

	if (req.app.locals.filter) files = files.filter(req.app.locals.filter)
	files = files.sort(fs.sortFiles)

	const playlist = m3uWriter()
	for (let file of files) {
		try {
			const {title, artist} = yield readID3Tags(file.absolute)

			let duration = title && artist ? yield readDuration(file.absolute) : 0
			if (duration) duration = Math.round(duration)

			const link = url.format({
				protocol: req.get('x-forwarded-proto') || req.protocol,
				host: req.get('host'),
				pathname: encodeURI(file.path.slice(1))
			})

			playlist.file(link, duration || 1, [
				artist || 'unknown artist',
				'-',
				title || 'unknown title'
			].join(' '))
		} catch (err) {
			continue
		}
	}

	res.status(200)
	.type('application/vnd.apple.mpegurl')
	.end(playlist.toString())
})

module.exports = playlist
