<style>
{% include "./css/upload.css" %}
</style>

<form id="upload" class="container" action="{{ path }}" method="POST" enctype="multipart/form-data">
	<label id="upload-files">
		<input name="files" type="file" required multiple>
	</label>
	<input id="upload-submit" type="submit" value="upload">
</form>
