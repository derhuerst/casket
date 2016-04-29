'use strict'

const multer   = require('multer')

const upload = (root) => multer({dest: root}).array('files')

module.exports = upload
