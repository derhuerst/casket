path =			require 'path'
url =			require 'url'
fs =			require 'fs'
httpError =		require 'http-errors'
swig =			require 'swig'





generateOutput = swig.compileFile path.join __dirname, 'directory.swig'



module.exports = list = (baseUrl, root, casket) ->
	if not baseUrl? then throw new Error 'Missing `baseUrl`.'
	baseUrl = path.normalize path.join '/', baseUrl
	console.log 'baseUrl', baseUrl
	if not root? then throw new Error 'Missing `root` path.'
	return (request, response, next) ->

		if request.method isnt 'GET' and request.method isnt 'HEAD'
			response.status if request.method is 'OPTIONS' then 200 else 405
			response.setHeader 'Allow', 'GET', 'HEAD', 'OPTIONS'
			return response.end()

		requested = path.normalize decodeURIComponent url.parse(request.url).pathname
		absolute = path.join root, requested

		fs.stat absolute, (error, stats) ->
			if error
				if error.code is 'ENOENT' then return next httpError 404, 'Not found.'
				else return next httpError 500, 'Internal server error.'

			if not stats.isDirectory() then return next()   # todo: is this enough?

			fs.readdir absolute, (error, files) ->
				if error then return next httpError 500,  'Internal server error'

				parents = [
					name: casket
					url: baseUrl
				]
				traversal = baseUrl
				for part in requested.split path.sep
					continue if part is ''
					traversal = path.join traversal, part
					parents.push
						name: part
						url: traversal

				link = path.join baseUrl, requested
				for file, i in files
					files[i] =
						name: path.basename file
						url: path.join link, file

				response.status 200
				response.setHeader 'Content-Type', 'text/html'
				response.end generateOutput
					casket: casket
					path: requested
					breadcrumb: parents
					files: files
