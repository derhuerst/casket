Q =				require 'q'
fs =			require 'fs-promise'
# todo: switch to `q-io`
formidable =	require 'formidable'
path =			require 'path'





receiveFiles = (ctx) ->
	deferred = Q.defer()
	files = []

	incoming = new formidable.IncomingForm
		uploadDir:		ctx.path
		keepExtensions:	true
	 	# todo: 413 request too large
		maxFieldsSize:	10 * 1024 * 1024   # 10MB todo: make this an options
		maxFields:		10
	files = []
	incoming.on 'fileBegin', (name, file) ->
		file.path = path.join path.dirname(file.path), file.name   # correct file name
	incoming.on 'file', (name, file) ->
		files.push file.toJSON()
	incoming.on 'error', (err) -> deferred.reject err
	incoming.on 'aborted', () -> deferred.resolve files
	incoming.on 'end', () -> deferred.resolve files

	incoming.parse ctx.req
	return deferred.promise



module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (ctx) ->
		fs.stat(ctx.path)
		.then (stats) ->
			if not stats.isDirectory() then throw new ctx.HttpError 'Forbidden', 403
			return receiveFiles(ctx)
			.then (files) ->
				nFiles = []
				for file in files
					nFiles.push
						name: file.name
						path: path.join ctx.url.pathname, file.name
				ctx.status(303).redirect ctx.url.pathname
				switch ctx.accepted
					when 'html' then ctx.html '<p>Uploaded</p>'   # todo: use templates
					when 'json' then ctx.json nFiles
					else
						result = ''
						for file in nFiles
							result += file.name + '\n'
						ctx.text result
			, (err) ->
				throw ctx.unknownError
		, (err) ->
			if err.code is 'ENOENT'
				throw new ctx.HttpError 'Not found', 404
			else throw ctx.unknownError
		.catch (err) ->
			ctx.error err
			return true
		.done()
