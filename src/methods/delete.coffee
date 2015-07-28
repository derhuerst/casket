Q =				require 'q'
fs =			require 'fs-promise'
# todo: switch to `q-io`
rmdir =			require 'rimraf-promise'
path =			require 'path'





module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (ctx) ->
		fs.stat(ctx.path)
		.then (stats) ->
			if stats.isDirectory() then promise = rmdir ctx.path
			else if stats.isFile() then promise = fs.unlink ctx.path
			else throw ctx.unknownError
			return promise
			.then null, (err) ->
				throw ctx.unknownError
		, (err) ->
			if err.code is 'ENOENT'
				throw new ctx.HttpError 'Not found', 404
			else throw ctx.unknownError
		.then () ->
			ctx.status(303).redirect path.dirname ctx.url.pathname
			switch ctx.accepted
				when 'html' then ctx.html '<p>Deleted</p>'   # todo: use templates
				when 'json' then ctx.json { message: 'Deleted' }
				else ctx.text 'Deleted'
			return true
		.catch (err) ->
			ctx.error err
			return true
		.done()
