module.exports = (casket) ->
	if not casket? then throw new Error 'Missing `casket` parameter'

	return (req, res) ->
		res.statusCode = 200
		res.end 'todo'
