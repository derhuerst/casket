'use strict'

const read  = require('fs').readFileSync
const path  = require('path')
const h     = require('pithy')

const css = {
	  base:   read(path.join(__dirname, '../css/base.css'))
	, dir:    read(path.join(__dirname, '../css/dir.css'))
	, menu:   read(path.join(__dirname, '../css/menu.css'))
	, upload: read(path.join(__dirname, '../css/upload.css'))
}
const js = {
	  fetch:  read(require.resolve('whatwg-fetch/fetch'))
	, delete: read(path.join(__dirname, '../js/delete.js'))
	, upload: read(path.join(__dirname, '../js/upload.js'))
}



const head = (_) => `
<!DOCTYPE html><html>
<head>
	<title>${_.name}${_.path}</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<style>${css.base}</style>
</head>`

const partOfPath = (part, i, all) =>
	h.li(i === (all.length - 1) ? '.active' : null, [
		h.a({href: encodeURI(part.path)}, part.name)
	])

const menu = (_) => `
<style>${css.menu}</style>
<div id="menu"><ul id="breadcrumb" class="container">`
+ _.breadcrumb.map(partOfPath).join('\n')
+ `</ul></div>`

const upload = (_) => `
<style>${css.upload}</style>

<form id="upload" class="container" action="${_.path}" method="POST" enctype="multipart/form-data">
	<label id="upload-files">
		<span class="button">select files</span>
		<input name="files" type="file" required multiple>
	</label>
	<input id="upload-submit" type="submit" value="upload">
</form>
<script type="application/javascript">${js.upload}</script>`

const file = (file) => `
<tr class="file"><td class="file-name">
	<a href="${encodeURI(file.path)}">
		${file.name}${file.isDir ? '<span class="file-suffix">/</span>' : ''}
	</a>
</td><td class="file-actions">
	<form class="file-actions-delete" method="DELETE"
		action="${encodeURI(file.path)}">
		<input class="file-actions-delete-button" type="submit" value="delete">
	</form>
</td></tr>`



const ui = (_) =>
  head(_)
+ `<body>`
+ menu(_)
+ upload(_)
+ `<style>${css.dir}</style>

<div id="directory" class="container">
	<table id="files" sortable>`
+ _.files.map(file).join('\n')
+ `
	</table>
</div>
<script type="application/javascript">${js.fetch}</script>
<script type="application/javascript">${js.delete}</script>
</body></html>`

module.exports = ui
