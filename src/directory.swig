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


.container {
	margin: 0 auto;
	max-width: 40em;
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
	margin: .7em 0;
	list-style: none;
}

#files li {
	display: block;
}
#files li:last-child {
	border-bottom: 0;
}

#files li a {
	display: block;
	padding: .2em 0;
	margin: .4em 0;
	border-bottom: 1px solid transparent;
	background-color: transparent;
}
#files li a:hover {
	color: #333;
	border-bottom-color: #bbb;
}
#files li a:active {
	color: #000;
	border-bottom-color: #000;
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

<ul id="files">
	<div class="container">
		{% for file in files %}
			<li>
				<a href="{{ file.path }}">{{ file.name }}</a>
				<form class="delete" method="DELETE" action="{{ file.path }}">
					<input type="submit" value="remove">
				</form>
			</li>
		{% endfor %}
	</div>
</ul>

</body></html>
