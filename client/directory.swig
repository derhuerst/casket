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
					<form class="file-actions-delete" method="DELETE" action="{{ file.path }}">
						<input class="file-actions-delete-button" type="submit" value="delete"/>
					</form>
				</td>
			</tr>
		{% endfor %}
	</table>
</div>

<script type="application/javascript">
{% include "./js/delete.js" %}
</script>

{% include "./upload.swig" %}

</body>
</html>
