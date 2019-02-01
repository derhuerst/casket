'use strict'

const fs = require('mz/fs')
const natsort = require('natsort').default({insensitive: true})
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
	return fs.stat(path)
	.then(({size}) => {
		return new Promise((resolve, reject) => {
			file(path)
			.read(offset, Math.min(size, bytes), (err, data) => {
				if (err) reject(err)
				else resolve(data)
			})
		})
	})
}

module.exports = {isDir, sortFiles, slice, readDir: fs.readdir, stat: fs.stat}
