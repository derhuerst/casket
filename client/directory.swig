{% include "./head.swig" %}
<body>
{% include "./menu.swig" %}

<style>
{% include "./css/directory.css" %}
</style>

<div id="directory" class="container">
	<table id="files" sortable>
		{% for file in files %}
			<tr class="file">
				<td class="file-name">
					<a href="{{ file.path }}">{{ file.name }}</a>
				</td>
				<td class="file-actions">
					<form method="DELETE" action="{{ file.path }}">
						<input type="submit" value="delete"/>
					</form>
				</td>
			</tr>
		{% endfor %}
	</table>
</div>

</body>
</html>
