path =			require 'path'
http =			require 'http'
url =			require 'url'
accepts =		require 'accepts'

onOPTIONS =		require './methods/options'
onGET =			require './methods/get'
onPOST =		require './methods/post'
onDELETE =		require './methods/delete'
Context =		require './Context'





module.exports =



	onOPTIONS:	onOPTIONS
	onGET:		onGET
	onPOST:		onPOST
	onDELETE:	onDELETE

	Context:	Context



	dir:		null
	name:		null
	log:		null
	cors:		false



	init: (dir, name, log) ->
		if not dir? then throw new Error 'Missing `dir` parameter'
		@dir = path.normalize dir
		@relative = path.join '.', path.relative process.cwd(), @dir

		if not name? then throw new Error 'Missing `name` parameter'
		@name = name

		if not log? then throw new Error 'Missing `log` parameter'
		@log = log

		@onOPTIONS = @onOPTIONS this
		@onGET = @onGET this
		@onPOST = @onPOST this
		@onDELETE = @onDELETE this

		thus = this
		@server = http.createServer (req, res) ->
			thus.log.info res.statusCode, req.method, req.url

			context = Object.create thus.Context
			context.init thus.dir, req, res, thus.cors

			handle = thus['on' + req.method.toUpperCase()]
			if not handle then return context.error new context.HttpError 405, 'Invalid HTTP method'

			handle context
			# todo: handle errors

		return this



	listen: (port, callback) ->
		@server.listen port, () =>
			@log.info "Serving #{@relative} as '#{@name}' on port #{port}."
			callback?()
		return this

	close: (callback) ->
		@server.close () ->
			@log.info "Stopped serving '#{@name}'."
			callback?()
		return this
