'use strict'

const {parse} = require('id3-parser')

const fs = require('./fs')

const readID3Tags = (path) => {
	return fs.slice(path, 100 * 1024)
	.then((data) => parse(data))
}

module.exports = readID3Tags
