#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const casket = require('./lib')

const help = `
Usage:
	casket [--name my-little-server] [--dir ~/path/to/dir]

Options:
    --name     -n  The name of the server, as shown in the GUI.
    --dir      -d  The directory to serve, default is the current directory.
    --readonly -r  Do not allow deletion of files & uploads.

`



const argv = minimist(process.argv.slice(2))

if (argv.help || argv.h) {
	process.stdout.write(help)
	process.exit(0)
}

casket({
	  name: argv.name || argv.n || 'casket'
	, root: argv.dir  || argv.d || process.cwd()
	, readonly: argv.readonly || argv.r || false
})
.listen(argv.port || argv.p || 8000)
