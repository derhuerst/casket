<style>
{% include "./css/menu.css" %}
</style>

<div id="menu">
	<ul id="breadcrumb">
		<div class="container">
			{% for entry in breadcrumb %}
				<li{% if loop.last %} class="active"{% endif %}>
					<a href="{{ entry.path }}">{{ entry.name }}</a>
				</li>
			{% endfor %}
		</div>
	</ul>
</div>
