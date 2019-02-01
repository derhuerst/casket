'use strict'

const createConversionQueue = require('audio-conversion-queue')
const path = require('path')
const send = require('send')

const queue = createConversionQueue([
	'-format', 'mp3', // MP3 container
	'-acodec', 'mp3',
	'-ar', '44100', // sampling rate
	'-ab', '192k', // bitrate
	'-map_metadata', '0', // copy metadata
	'-id3v2_version', '3' // use ID3v2
])

const sendConverted = (req, res, next) => {
	if (!req.query || req.query['as-mp3'] !== 'true') return next()

	queue.convert(req.absolute, (err, dest, purge) => {
		if (err) return next(err)

		send(req, dest)
		.pipe(res)
		.once('error', (err) => {
			purge()
			next(err)
		})
		.once('finish', () => {
			purge(next)
		})
	})
}

module.exports = sendConverted
