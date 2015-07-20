path =			require 'path'
HttpError =		require('http-error').HttpError





unknownError = new HttpError 'Unknown error', 500



module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (req, res) ->
		requested = path.normalize req.url.pathname
		absolute = path.join casket.absolute, requested

		remove absolute, (err, response) ->
			if error then return res.error err.code, err.message
			res.statusCode = 200
			res.end response
			# todo: content types



remove = (path, cb) ->
	fs.stat path, (err, stats) ->
		if err & err.code is 'ENOENT' then return cb new HttpError 'Not found', 404
		else if err then return cb unknownError
		console.log err

		if stats.isDirectory() then method = fs.rmdir
		else if stats.isFile() then method = fs.unlink
		else return cb unknownError

		method path, (err) ->
			console.log err
			if error then return cb unknownError

			# success
			cb null, 'Deleted'
