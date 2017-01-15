'use strict'

const path = require('path')

const breadcrumb = (name, relative) =>
	[{name, path: '/'}].concat(
		relative.split(path.sep)
		.filter((segment) => segment.length > 0)
		.map((segment, i, all) => ({
			  name: segment
			, path: '/' + all.slice(0, i + 1).join(path.sep)
		}))
	)

module.exports = breadcrumb
