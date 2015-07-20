path =			require 'path'
url =			require 'url'
HttpError =		require('http-error').HttpError
fs =			require 'fs'
swig =			require 'swig'
send =			require 'send'





unknownError = new HttpError 'Unknown error', 500



# todo: rewrite promise-based
module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (req, res) ->
		requested = path.normalize req.url.pathname
		absolute = path.join casket.dir, requested

		error = (err) ->
			console.trace()
			res.error err.code, err.message

		fs.stat absolute, (err, stats) ->
			console.log absolute
			console.log err
			if err and err.code is 'ENOENT' then return error new HttpError 'Not found', 404
			else if err then return error unknownError

			if stats.isDirectory()

				if '/' isnt requested.substr -1
					res.statusCode = 303
					req.url.pathname += '/'
					res.setHeader 'Location', url.format req.url
					return res.end 'Redirecting'

				fs.readdir absolute, (error, files) ->
					if error then return error unknownError
					switch req.accepted.type 'html', 'json'
						when 'html'
							breadcrumb = [
								name: casket.name
								path: '/'
							]
							traversal = '/'
							for part in path.relative('/', requested).split path.sep
								traversal = path.join traversal, part
								breadcrumb.push
									name: part
									path: traversal

							for file, i in files
								files[i] =
									name: path.basename file
									path: path.join requested, file

							res.end directoryAsHTML
								name: casket.name
								path: requested
								breadcrumb: breadcrumb
								files: files
						when 'json'
							res.setHeader 'Content-Type', 'application/json'
							res.end directoryAsJSON files
						else
							res.setHeader 'Content-Type', 'text/plain'
							res.end directoryAsText files


			else if stats.isFile()

				file = send req, absolute,
					dotfiles:	'deny'
					index:		false
				file.pipe res
				file.on 'error', (err) ->
					error unknownError


			else return error unknownError





directoryAsHTML = swig.compileFile path.join __dirname, '..', 'directory.swig'   # todo: reuse template parts

directoryAsJSON = (files) ->
	results = []
	for file, i in files
		results.push
			name: path.basename file
			path: path.join requested, file
	return JSON.stringify results

directoryAsJSON = (files) ->
	result = ''
	for file, i in files
		result += path.basename file + '\n'
	return result
