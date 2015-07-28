url =			require 'url'
path =			require 'path'
accepts =		require 'accepts'
HttpError =		require('http-error').HttpError





module.exports =



	HttpError:		HttpError
	unknownError:	null


	url:			null
	path:			null



	init: (dir, req, res, cors) ->
		if not dir? then throw new Error 'Missing `dir` parameter'

		if not req? then throw new Error 'Missing `req` parameter'
		@req = req

		@url = url.parse req.url
		@url.pathname = path.normalize @url.pathname   # for security
		@path = path.join dir, @url.pathname

		@accepted = accepts(req).type 'html', 'json'

		if not res? then throw new Error 'Missing `res` parameter'
		@res = res

		if cors is true
			@res.setHeader 'Access-Control-Allow-Origin', '*'
			@res.setHeader 'Access-Control-Allow-Methods', '*'
			@res.setHeader 'Access-Control-Allow-Headers', '*'
			@res.setHeader 'Access-Control-Expose-Headers', '*'

		@unknownError = new @HttpError 'Unknown error', 500

		return this



	error: (err) ->
		err.statusCode ?= 500
		err.message ?= 'Internal server error'
		@res.statusCode = err.code or err.statusCode
		switch @accepted
			when 'html' then @html "<h1>Error #{err.code or err.statusCode}</h1><p>#{err.message}</p>"
			when 'json' then @json
				status:		'error',
				code:		err.code or err.statusCode,
				message:	err.message
			else @text err.message
		return this

	status: (statusCode) ->
		@res.statusCode = statusCode or 200
		return this

	html: (data) ->
		@res.setHeader 'Content-Type', 'text/html'
		@res.end data
		return this

	json: (data) ->
		data.status ?= 'ok'
		@res.setHeader 'Content-Type', 'application/json'
		@res.end JSON.stringify data
		return this

	text: (data) ->
		@res.setHeader 'Content-Type', 'text/plain'
		@res.end data
		return this



	redirect: (url) ->
		@res.statusCode = 303
		@res.setHeader 'Location', url
		return this
