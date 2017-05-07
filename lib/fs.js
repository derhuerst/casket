'use strict'

const fs = require('fs-promise')
const natsort = require('natsort')({insensitive: true})
const file = require('random-access-file')



const isDir = (dir) =>
	fs.stat(dir)
	.then((s) => s.isDirectory())

const sortFiles = (fileA, fileB) => {
	if (fileA.isDir && !fileB.isDir) return -1
	if (fileB.isDir && !fileA.isDir) return 1
	return natsort(fileA.name, fileB.name)
}

const slice = (path, bytes, offset = 0) => {
	return new Promise((resolve, reject) => {
		file(path)
		.read(offset, bytes, (err, data) => {
			if (err) reject(err)
			else resolve(data)
		})
	})
}

module.exports = {isDir, sortFiles, slice, readDir: fs.readdir, stat: fs.stat}
