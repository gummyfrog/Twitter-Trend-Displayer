document.write(
	`
<div class="bg-light border-right" id="sidebar-wrapper">
	<div class="sidebar-heading"> 
        <div class="title-icon"><i class="fas fa-tractor"></i></div>
		Twitter Farms
	</div>

    <div class="theme-switch-wrapper list-group-item">
        <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round"></div>
      </label>
    </div>

	<div class="list-group list-group-flush">
		<a href="/about" class="list-group-item list-group-item-action">About</a>
		<a href="/recent" class="list-group-item list-group-item-action">Most Recent Snapshot</a>
		<a href="/daily" class="list-group-item list-group-item-action">Daily Trends</a>
		<a href="/weekly" class="list-group-item list-group-item-action">Weekly Trends</a>
		<ol id="sidebar-activity" class="list-group-item"></ol>
	</div>


</div>

`);


const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }    
}


toggleSwitch.addEventListener('change', switchTheme, false);


const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}
