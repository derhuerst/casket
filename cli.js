#!/usr/bin/env node
'use strict'

const argv   = require('yargs').argv
const casket = require('./lib')

if (argv.help || argv.h) {
	process.stdout.write(`
casket [--name my-little-server] [--dir ~/path/to/dir]

Options:
    --name -n The name of the server, as shown in the GUI.
    --dir  -d The directory to serve, default is the current directory.

`)
	process.exit(0)
}

casket({
	  name: argv.name || argv.n || 'casket'
	, root: argv.dir  || argv.d || process.cwd()
})
.listen(argv.port || argv.p || 8000)
