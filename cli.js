#!/usr/bin/env node
'use strict'

const Koa    = require('koa')
const casket = require('./lib')

new Koa()
.use(casket(process.argv[2] || __dirname))
.listen(8000)
