path =			require 'path'
http =			require 'http'
url =			require 'url'
accepts =		require 'accepts'





module.exports =



	_options:	require './methods/options'
	_get:		require './methods/get'
	_post:		require './methods/post'
	_delete:	require './methods/delete'

	_methods: {}



	cors: false



	init: (dir, name, logger) ->
		if not dir? then throw new Error 'Missing `dir` parameter'
		@dir = path.normalize dir
		@relative = path.join '.', path.relative process.cwd(), @dir

		if not name? then throw new Error 'Missing `name` parameter'
		@name = name

		if not logger? then throw new Error 'Missing `logger` parameter'
		@logger = logger

		for method in ['options', 'get', 'post', 'delete']
			@_methods[method] = @['_' + method] this

		thus = this
		@server = http.createServer (req, res) ->
			thus._onRequest req, res
		return this



	listen: (port, callback) ->
		@server.listen port, () =>
			@logger.info "Serving #{@relative} as '#{@name}' on port #{port}."
			callback?()
		return this

	close: (callback) ->
		@server.close () ->
			@logger.info "Stopped serving '#{@name}'."
			callback?()
		return this



	_onRequest: (req, res) ->
		thus = this

		# error handle
		res.error = (code, message) ->
			res.statusCode = code
			res.statusMessage = message
			res.end message

		# logging
		res.on 'finish', () ->
			thus.logger.info res.statusCode, req.method, req.url.pathname

		# parsed url
		req.originalUrl = req.url
		req.url = url.parse req.url

		# accepted content type & encoding
		req.accepted = accepts req

		if @cors
			res.setHeader 'Access-Control-Allow-Origin', '*'
			res.setHeader 'Access-Control-Allow-Methods', '*'
			res.setHeader 'Access-Control-Allow-Headers', '*'
			res.setHeader 'Access-Control-Expose-Headers', '*'

		# method handles
		handle = @_methods[req.method.toLowerCase()]
		if not handle then return res.error 405, 'Invalid HTTP method'
		handle req, res
