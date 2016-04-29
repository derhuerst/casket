'use strict'

const multer = require('koa-multer')

const upload = (root) => multer({dest: root}).array('files')

module.exports = upload
