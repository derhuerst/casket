'use strict'

const fs = require('fs-promise')
const natsort = require('natsort')({insensitive: true})



const isDir = (dir) =>
	fs.stat(dir)
	.then((s) => s.isDirectory())

const sortFiles = (fileA, fileB) => {
	if (fileA.isDir && !fileB.isDir) return -1
	if (fileB.isDir && !fileA.isDir) return 1
	return natsort(fileA.name, fileB.name)
}

module.exports = {isDir, sortFiles, readDir: fs.readdir, stat: fs.stat}
