'use strict'

const fs = require('fs-promise')
const path = require('path')



const isDir = (dir) =>
	fs.stat(dir)
	.then((s) => s.isDirectory())

const sortFiles = (fileA, fileB) => {
	if (fileA.isDir && !fileB.isDir) return -1
	if (fileB.isDir && !fileA.isDir) return 1
	if (fileA.name < fileB.name) return -1
	if (fileA.name > fileB.name) return 1
	return 0
}

module.exports = {isDir, sortFiles, readDir: fs.readdir, stat: fs.stat}
