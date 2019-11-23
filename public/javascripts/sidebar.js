document.write(
	`
<div class="bg-light border-right" id="sidebar-wrapper">
	<div class="sidebar-heading"> 
		<div class="dripcss"><div></div></div>
		Twitter Tracker.
	</div>


	<div class="list-group list-group-flush">
		<a href="/about" class="list-group-item list-group-item-action bg-light">About</a>
		<a href="/recent" class="list-group-item list-group-item-action bg-light">Most Recent Snapshot</a>
		<a href="/daily" class="list-group-item list-group-item-action bg-light">Daily Trends</a>
		<a href="/weekly" class="list-group-item list-group-item-action bg-light">Weekly Trends</a>
		<a class="list-group-item list-group-item-action bg-light construction">Construction</a>	
		<ol id="sidebar-activity" class="list-group-item bg-light"></ol>
	</div>


</div>

`);