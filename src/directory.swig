<!DOCTYPE html>

<html><head>
	<title>{{ name }}/{{ path }}</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<style>
* {
	margin: 0;
	padding: 0;
}

body {
	font-size: 120%;
	line-height: 1.4;
	font-family: "Helvetica Neue", Helvetica, sans-serif;
	color: #333;
	background-color: white;
}

a {
	text-decoration: none;
	color: #555;
}

button {
	padding: .2em .2em;
	font-size: 80%;
	line-height: 1;
	color: #e74c3c;
	background-color: transparent;
	border: none;
	cursor: pointer;
	--webkit-appearance: none;
}
button:hover {
	color: white;
	background-color: #e74c3c;
}


.container {
	margin: 0 auto;
	max-width: 35em;
}


#breadcrumb {
	margin-left: -1.4em;
	line-height: 2.6;
	list-style: none;
	background-color: #f0f0f0;
	border-bottom: 1px solid #bbb;
}

#breadcrumb li {
	display: inline-block;
}

#breadcrumb li a {
	position: relative;
	display: inline-block;
	padding: 0 .7em;
	margin-right: 1.4em;
	background-color: transparent;
	color: #333;
}
#breadcrumb li a:hover {
	background-color: #ddd;
	color: #111;
}
#breadcrumb li a:active {
	background-color: #bbb;
	color: #000;
}
#breadcrumb li a:after {
	content: " / ";
	display: block;
	position: absolute;
	top: 0;
	left: 100%;
	padding: 0 .7em;
	display: block;
}
#breadcrumb li:last-child a:after {
	display: none;
}

#files {
	width: 100%;
	margin: .7em 0 1em 0;
	border-spacing: 0;
}

#files .file td {
	padding: .2em 0;
	border-bottom: 1px solid transparent;
}
#files .file:hover td {
	border-bottom-color: #bbb;
}

#files .file .file-name a {
	display: block;
}
#files .file .file-name a:hover {
	color: #333;
}
#files .file .file-name a:active {
	color: #000;
}

#files .file .file-actions{
	width: 3.5em;
	text-align: right;
}

#files .file .file-actions form input{
	vertical-align: middle;
}
	</style>
</head><body>

<ul id="breadcrumb">
	<div class="container">
		{% for entry in breadcrumb %}
			<li><a href="{{ entry.path }}">{{ entry.name }}</a></li>
		{% endfor %}
	</div>
</ul>

<div class="container">

	<table id="files" sortable>
		{% for file in files %}
			<tr class="file">
				<td class="file-name">
					<a href="{{ file.path }}">{{ file.name }}</a>
				</td>
				<td class="file-actions">
					<button type="submit" formmethod="DELETE" formaction="{{ file.path }}" alt="delete {{ file.name }}">delete</button>
				</td>
			</tr>
		{% endfor %}
	</table>

</div>

</body></html>
