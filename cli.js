#!/usr/bin/env node
'use strict'

const argv   = require('yargs').argv
const casket = require('./lib')

casket({
	  name: argv.name || argv.n || 'casket'
	, root: argv.dir  || argv.d || process.cwd()
})
.listen(argv.port || argv.p || 8000)
