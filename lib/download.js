'use strict'

const path     = require('path')
const serve    = require('serve-static')

const download = (root) => serve(root, {
	  dotfiles: 'allow'
	, index:    false
	, redirect: false
})

module.exports = download
