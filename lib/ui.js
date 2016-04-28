'use strict'

const read  = require('fs').readFileSync
const path  = require('path')
const h     = require('pithy')
const so    = require('so')
const fs    = require('fs-promise')

const css = {
	  base:   read(path.join(__dirname, '../css/base.css'))
	, dir:    read(path.join(__dirname, '../css/dir.css'))
	, menu:   read(path.join(__dirname, '../css/menu.css'))
	, upload: read(path.join(__dirname, '../css/upload.css'))
}
const js = {
	  delete: read(path.join(__dirname, '../js/delete.js'))
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
<form id="upload" class="container" action="${_.path}" method="POST" enctype="multipart/form-data">
	<label id="upload-files">
		<input name="files" type="file" required multiple>
	</label>
	<input id="upload-submit" type="submit" value="upload">
</form>`

const file = (file) => `
<tr class="file"><td class="file-name">
	<a href="${encodeURI(file.path)}">${file.name}</a>
</td><td class="file-actions">
	<form class="file-actions-delete" method="DELETE"
		action="${encodeURI(file.path)}">
		<input class="file-actions-delete-button" type="submit" value="delete">
	</form>
</td></tr>`

const directory = (_) =>
  head(_)
+ `<body>`
+ menu(_)
+ `<style>${css.dir}</style>

<div id="directory" class="container">
	<table id="files" sortable>`
+ _.files.map(file).join('\n')
+ `
	</table>
</div>
<script type="application/javascript">${js.delete}</script>`
+ upload(_)
+ `</body></html>`



const ui = so(function* (ctx, next) {
	const dir = path.join(ctx.base, path.relative('/', ctx.path))
	const content = yield fs.readdir(dir)

	const breadcrumb = [{name: ctx.name, path: '/'}].concat(
		ctx.path.split(path.sep).filter((p) => p.length > 0)
		.map((name, i, all) => ({
			  name: name
			, path: all.slice(0, i + 1).join(path.sep)
		})))
	const files = content.map((name) => ({
		  name: name
		, path: path.join(ctx.path, name)
	}))

	ctx.type = 'text/html'
	ctx.body = directory({name: ctx.name, path: ctx.path, breadcrumb, files})
})

module.exports = ui
