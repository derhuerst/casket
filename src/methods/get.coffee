path =			require 'path'
Q =				require 'q'
fs =			require 'fs-promise'
# todo: switch to `q-io`
send =			require 'send'
url =			require 'url'
swig =			require 'swig'

# todo:
# - move template logic to `src/Context`
# - use sub-templates for different bodys
directoryTpl =	swig.compileFile "#{__dirname}/../../client/directory.swig"






sendFile = (ctx) ->
	deferred = Q.defer()
	stream = send ctx.req, ctx.path,
		dotfiles:	'deny'
		index:		false
	stream.pipe ctx.res
	stream.on 'end', () ->
		deferred.resolve true
	stream.on 'error', () ->
		deferred.reject ctx.unknownError
	return deferred.promise



directoryAsHtml = (casket, ctx, files) ->
	breadcrumb = [
		name: casket.name
		path: '/'
	]
	traversal = '/'
	for part in ctx.url.pathname.split path.sep
		continue if part is ''
		traversal = path.join traversal, part
		breadcrumb.push
			name: part
			path: traversal

	return directoryTpl
		name: casket.name
		path: ctx.url.pathname
		breadcrumb: breadcrumb
		files: files



module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (ctx) ->
		fs.stat(ctx.path)
		.then (stats) ->

			if stats.isFile()

				return sendFile(ctx)
				.then () ->
					return true
				, (err) ->
					throw ctx.unknownError

			else if stats.isDirectory()

				if '/' isnt ctx.url.pathname.substr -1
					ctx.url.pathname += '/'
					ctx.status(303).redirect url.format ctx.url
					switch ctx.accepted
						when 'html' then ctx.html '<p>Redirecting</p>'   # todo: use templates
						when 'json' then ctx.json { message: 'Redirecting' }
						else ctx.text 'Redirecting'
					return true

				return fs.readdir(ctx.path)
				.then (files) ->
					nFiles = []
					for file, i in files
						continue if path.basename(file).substr(0, 1) is '.'
						nFiles.push
							name: path.basename file
							path: path.join ctx.url.pathname, file
					switch ctx.accepted
						when 'html' then ctx.html directoryAsHtml casket, ctx, nFiles   # todo: use templates
						when 'json' then ctx.json nFiles
						else
							result = ''
							for file in nFiles
								result += file.name + '\n'
							ctx.text result
					return true
				, (err) ->
					throw ctx.unknownError

			else throw ctx.unknownError
		,  (err) ->
			if err.code is 'ENOENT'
				throw new ctx.HttpError 'Not found', 404
			else throw ctx.unknownError
		.catch (err) ->
			ctx.error err
			return true
		.done()
