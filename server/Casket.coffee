path =			require 'path'
express =		require 'express'
list =			require './list'





module.exports =



	_errorHandler: (error, request, response, next) ->
		if (error)
			#console.error error.statusCode, request.url
			console.error error
			#response.status error.statusCode
			#response.end error.message or ''



	init: (directory, name) ->
		@absolute = directory
		@path = './' + path.relative process.cwd(), directory
		@name = name

		@server = express @absolute
		@server.use '/files', list '/files', @absolute, @name
		@server.use '/files', express.static @absolute,
			dotfiles:	'allow'
			etag:		false
			index:		false
		@server.use @_errorHandler

		return this



	listen: (port) ->
		@server.listen port
		console.log "Serving #{@path} as '#{@name}' on port #{port}."

		return this
