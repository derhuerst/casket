path =			require 'path'
fs =			require 'fs'
rmdir =			require 'rmdir'
HttpError =		require('http-error').HttpError





unknownError = new HttpError 'Unknown error', 500



module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (req, res) ->
		requested = path.normalize req.url.pathname
		absolute = path.join casket.dir, requested

		remove absolute, (err, response) ->
			if err then return res.error err.code, err.message
			res.statusCode = 303
			res.setHeader 'Location', path.dirname requested
			res.end response
			# todo: content types



remove = (path, cb) ->
	console.log('path', path);
	fs.stat path, (err, stats) ->
		if err and err.code is 'ENOENT' then return cb new HttpError 'Not found', 404
		else if err then return cb unknownError

		if stats.isDirectory() then method = rmdir
		else if stats.isFile() then method = fs.unlink
		else return cb unknownError

		method path, (err) ->
			if err then return cb unknownError

			# success
			cb null, 'Deleted'
