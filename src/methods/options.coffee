module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (ctx) ->
		ctx.status 200
		ctx.res.setHeader 'Allow', 'OPTIONS, GET, POST, PUT, DELETE'
		ctx.res.end()
