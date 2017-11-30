'use strict'

const AirPlay = require('airplay-protocol')
const concat = require('concat-stream')
const {parse: parseUrl, format: formatUrl} = require('url')

const createToAirplay = (target) => {
	const airplay = new AirPlay(target)

	const toAirplay = (req, res, next) => {
		req.pipe(concat((path) => {
			path = path.toString('utf8')
			const parsed = parseUrl(path)
			Object.assign(parsed, {
				protocol: req.get('x-forwarded-proto') || req.protocol,
				host: req.get('host'),
				query: {'to-mp3': 'true'}
			})

			airplay.play(formatUrl(parsed), (err) => {
				if (err) return next(err)

				res.status(202)
				res.type('text')
				res.end('ok')
				next()
			})
		}))
	}
	return toAirplay
}

module.exports = createToAirplay
