class Carder {

	constructor() {

		this.element = document.getElementById("cards");

		this.colors = {
			0: ["#282a36", "#f8f8f2"],
			1: ["#367ABD", "#1d1e18"],
			2: ["#4CB2D4", "#1d1e18"],
			3: ["#9FD1F0", "#1d1e18"],
			4: ["#69C1FF", "#1d1e18"],
			5: ["#6AE83A", "#1d1e18"],
			6: ["#95EB00", "#1d1e18"],
			7: ["#fff950", "#1d1e18"],
			8: ["#FF9A08", "#1d1e18"],
			9: ["#EB7B2D", "#1d1e18"],
			10: ["#EE4035", "#1d1e18"],
		}
	}

	f(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	def(_arr) {
		// temporary function, this should never be a problem for real searches
		// result of the small data set and also I am retarded
		var obj = null;
		if(_arr.length <= 2 || _arr == undefined) {
			return _arr.concat([
				{key: "", value: 0},
				{key: "", value: 0},
				{key: "", value: 0},
				{key: "", value: 0},
				{key: "", value: 0},
				]);
		} else {
			return _arr;
		}

	}

	gettop(_arr, _count, _break = "") {
		var ret = [];
		for(var x=0;x<_count;x++) {
			if(_arr[x] == undefined) break;
			ret.push(`${_arr[x].key}`)
		}

		return ret.join(_break);
	}

	makeboxes(_arr, _classes, _count, _styles=[]) {
		var ret = [];
		for(var x=0;x<_count;x++) {
			if(_arr[x] == undefined) break;
			ret.push(`
				<div class=${_classes[0]}>
					<p ${_styles[x] != undefined ?`style="${_styles[x]}"` : ""} class=${_classes[1]}>${_arr[x].key}</p>
					<p class=${_classes[2]}>${this.f(_arr[x].value)}</p>
				</div>

				`)
		}

		return ret.join("");
	}

	total_children(puddle) {
		var count = 0;
		for(var c=0;c<puddle.children.length;c++) {
			count += 1;
			count += this.total_children(puddle.children[c]);
		}
		return count;
	}

	card(puddle, depth) {
		var fg = this.colors[depth][1];
		var bg = this.colors[depth][0];
		var card = `
		<div class="shadow" style="background-color: ${bg}; margin-top: 50px; margin-left: ${depth*40}px; height:${((this.total_children(puddle) || 0) * 144) +60}px"></div>

		<div class="card" style="color:${fg}; ${puddle.track=='.' ? "width: 100% !important;" : ""} background-color: ${bg}; margin-left: ${depth*40}px">
			<div class=card_title_box>
				<p class="card_emoji" style="text-shadow: -5px 5px ${fg}"> ${this.gettop(puddle.emojis, 2)} </p>
				<p class="card_title"> ${puddle.track == '.' ? `Daily Search at ${moment(puddle.start_time).format('LLLL')}` : puddle.track} </p>
				<p class="card_subtitle"> ${this.gettop(puddle.words, 6, ", ")} </p>
			</div>

			<div class=card_info_box>
				<p class="card_hashtag_child"> ${this.gettop(puddle.hashtags, 3," ")} </p>
			</div>
		</div>
		`

		this.element.innerHTML += card;
	}

	daily(data) {
		var fg = this.colors["0"][1];
		var bg = this.colors["0"][0];
		var card = `
		<div class="daily_card" style="background-color: ${bg}">
			<div class=title_box>
				<div class="emoji_container">
					${this.makeboxes(data.emojis, ["emoji_box", "emoji_key", "emoji_value"], 3, ["font-size: 35px", "font-size: 30px", "font-size: 30px"])}
				</div>

				<p class="title" style="color: ${fg}"> Overall Discoveries </p>
			</div>

			<div class="word_container">
				${this.makeboxes(data.words, ["word_box", "word_key", "word_value"], 4)}
			</div>

			<div class="word_container">
				${this.makeboxes(data.hashtags, ["word_box", "word_key", "word_value"], 4)}
			</div>


		</div>
		`

		this.element.innerHTML += card;
	}

	puddle_loop(puddle, depth = 0) {
		console.log(puddle)
		this.card(puddle, depth);
		for(var x=0;x<puddle.children.length;x++) {
			var next = puddle.children[x];
			this.puddle_loop(next, depth+1);
		}
	}
}

class timelineGraphHistory {

	constructor(data) {
		this.ctx = document.getElementById('timeline-graph').getContext('2d');
		this.charts = this.makeCharts(data);
		this.current_chart;
	}	

	displayChart(data) {
		if(this.current_chart != null) {
			this.current_chart.destroy();
		}
		this.current_chart = new Chart(this.ctx, data);
	}

	f(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	random_rgba() {
		var o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
	}

	getHistory(timeline) {
		var history = {};

		for(var x=0;x<timeline.length;x++) {
			var snap = timeline[x];

			for(var k=0;k<Object.keys(snap).length;k++) {
				var key = Object.keys(snap)[k];
				if(key!="start_time") {
					for(var y=0;y<snap[key].length;y++) {
						var point = snap[key][y];

						if(history[key] == undefined) {history[key]= {}}
						if(history[key][point.key] == undefined) {history[key][point.key] = []}

						history[key][point.key].push({t: moment.utc(snap.start_time), y: point.value});
					}
				}
			}
		}

		return(history);
	}

	makeCharts(data) {
		var history = this.getHistory(data.timeline_data);
		var charts = {};

		for(var x=0;x<Object.keys(history).length;x++) {
			var key = Object.keys(history)[x];

			var obj = {
				type: "line",
				data: {
					labels: [],
					datasets: [],
				},
				options: {

					tooltips: {
						titleFontSize: 20,
						bodyFontSize: 20,
					},
					scales: {
						xAxes: [{
							type: 'time',
							distribution: 'linear',
							ticks: {maxTicksLimit: 15}
						}],
						yAxes: [{
							display: false,
							ticks: {beginAtZero: false,}
						}],
					},
					legend: {
						display: true,
						position: "right",
						labels: {
							fontSize: 20,
							boxWidth: 10,
							usePointStyle: true,
							padding: 0,
						}
					},
				}
			}

			if(key == "hashtags") {
				obj.options.legend.labels.fontSize = 14;
			}

			var dataset_sortable = [];

			for(var y=0;y<Object.keys(history[key]).length;y++) {
				var histKey = Object.keys(history[key])[y];

				// don't chart things that show up less than X times
				if(history[key][histKey].length > 2) {
					var color = this.random_rgba()
					var total = history[key][histKey].reduce((acc, point) => acc + point.y, 0);
					var dataset = {
						label: histKey,
						data: history[key][histKey],
						backgroundColor: color,
						borderColor: color,
						fill: false,
						cubicInterpolationMode: "monotone",
					}

					obj.data.labels.push(moment.utc(history[key].start_time).toLocaleString())

					dataset_sortable.push({raw: dataset, value: total});
				}
			}

			console.log(dataset_sortable);

			obj.data.datasets = dataset_sortable.sort((a, b) => {return b.value - a.value}).map((sortable) => {return sortable.raw})
			.splice(0, 9);

			charts[key] = obj;
		}

		return(charts);
	}
}

var displayer = new Carder()
var title = $(document).attr('title');

var reference = "";

switch(title) {
	case "Recent": reference = "/single_recent"; break;
	case "Daily": reference = "/daily_recent"; break;
	default: reference = "/single_recent"; break;
}
	
var chart;

$.ajax({
  url: `https://frogeye.duckdns.org:8100${reference}`,
  dataType: "json",
  type: "GET",
}).done((res) => {
	if(title == "Recent") {
		console.log(res);
		var obj = res.data;
		displayer.puddle_loop(obj);
	} else {
		displayer.daily(res.data, 0)
		chart = new timelineGraphHistory(res.data);
		chart.displayChart(chart.charts.emojis)
	}

}).fail((err) => {
	console.log(err);
})

$.ajax({
  url: `https://frogeye.duckdns.org:8100/active`,
  dataType: "json",
  type: "GET",
}).done((data) => {
	console.log(data.active);
	var element = document.getElementById("sidebar-activity");
	for(var x=0;x<data.active.length;x++) {
		var track = data.active[x] == "." ? "Daily Search" : data.active[x];
		element.innerHTML += `<li><div class="dripcss"><div></div> <div></div></div> <p style="display: inline">${track}</p></li>`
	}
}).fail((err) => {
	console.log(err);
})
