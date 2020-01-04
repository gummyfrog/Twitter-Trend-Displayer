
class timelineGraphHistory {

	constructor(data, _type) {
		this.type = _type;
		this.colors = {
			0: ["#e1daec"],
			1: ["#c4b5da"],
			2: ["#a791c8"],
			3: ["#8a6cb6"],

			4: ["#6d48a4"],
			5: ["#57328d"],
			6: ["#462871"],
			7: ["#341e55"],
			8: ["#231439"],
			9: ["#8b88ab"],
			10: ["#64608f"],
			11: ["#3e3873"],
			12: ["#28225c"],
			13: ["#201b4a"],
			14: ["#181538"]
		}

		this.ctx = document.getElementById('timeline-graph').getContext('2d');
		this.current_chart;

		this.charts = this.makeCharts(data);
		this.generate_header(data);

	}

	f(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	random_rgba() {
		var o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
	}

	hsl_color(value){
	    var hue=((value)*200).toString(10);
		return ["hsl(",hue,",80%,50%)"].join("");
	}

	displayChart(data) {
		if(this.current_chart != null) {
			this.current_chart.destroy();
		}

		this.current_chart = new Chart(this.ctx, data);
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

		return ret.reverse().join("");
	}


	generate_header(data) {

		var title = ""
		if(this.type == "Daily") {
			title = "Daily Trends"
		} else if(this.type == "Weekly") {
			title = "Weekly Trends"
		}

		document.getElementById("header-title").innerHtml = title;

		var card = `
		<div class="title_box">
			<p class="title"> ${title} </p>
		</div>

		<div class="stat_container">
			${this.makeboxes(data.words, ["stat_box", "stat_key", "stat_value"], 3)}
		</div>

		<div class="stat_container">
			${this.makeboxes(data.hashtags, ["stat_box", "stat_box", "stat_value"], 3)}
		</div>

		<div class="stat_container">
			${this.makeboxes(data.emojis, ["stat_box", "emoji_key", "stat_value"], 3)}
		</div>
		`

		document.getElementById("header").innerHTML = card;
	}


	getSentiments(timeline) {
		var map = {};
		var res = [];
		var sentiments = timeline.map((obj) => {
			return {
				key: obj.hashtags[0].key, 
				value: (obj.sentiment-0.5)*2,
			}
		})

		sentiments.forEach((a) => {
			if (!map[a.key]) {
				map[a.key] = { key: a.key, value: a.value, color: 0};
				res.push(map[a.key]);
			}
			if(a.value < map[a.key].value) {
				map[a.key].value = a.value;
			}
			map[a.key].color = this.hsl_color(map[a.key].value);
		}, map);


		return(res.sort((a, b) => {return b.value - a.value}));
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


	makeSentimentChart(data) {
		var sentiments = this.getSentiments(data.timeline_data);
		var bar = {
			type: "horizontalBar",
			data: {
				labels: sentiments.map((a) => {return a.key}),
				datasets: [{
					label: "Sentiments.",
					barPercentage: 1,
					barThickness: "flex",
					data: sentiments.map((a) => {return a.value}),
					backgroundColor: sentiments.map((a) => {return a.color})
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,

				tooltips: {
					titleFontSize: 20,
					bodyFontSize: 20,
					callbacks: {
						label: function(tooltipItem, data) {
							var label = (Math.round(tooltipItem.xLabel * 100) / 100);

							var title = "";

							switch(true) {
								case label>0.8: 
									title = "Very Positive."
									break;
								case label>0.5: 
									title = "Mostly Positive."
									break;
								case label<0.3:
									title = "Very Negative."
									break;
								case label<0.5:
									title = "Mostly Negative."
									break;
								default: 
									title = "No clue!"
									break

							}

							return `${label} ${title}`;
						}
					}
				},
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						display: false,
						ticks: {
							fontSize: 10,
						},
					}],
					yAxes: [{
						display: true,
						ticks: {
							fontSize: 10,
						},
					}]
				}
			}
		}


		return(bar);

	}

	makeCharts(data) {
		var history = this.getHistory(data.timeline_data);
		var charts = {};
		charts.sentiment = this.makeSentimentChart(data);


		var spliceby;
		if(this.type == "Daily") {
			spliceby = 9
		} else {
			spliceby = 15
		}

		for(var x=0;x<Object.keys(history).length;x++) {
			var key = Object.keys(history)[x];

			var obj = {
				type: "line",
				data: {
					labels: [],
					datasets: [],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					tooltips: {
						titleFontSize: 20,
						bodyFontSize: 20,
					},
					scales: {
						xAxes: [{
							type: 'time',
							distribution: 'linear',
							ticks: {maxTicksLimit: 15},
						}],
						yAxes: [{
							display: false,
							ticks: {beginAtZero: false},
						}],
					},
					legend: {
						display: true,
						position: "top",
						align: "start",
						labels: {
							fontSize: 20,
							boxWidth: 10,
							usePointStyle: true,
							padding: 10,
							fontColor: "#5F369B"
						}
					},
				}
			}

			if(key == "hashtags") {
				obj.options.legend.labels.fontSize = 14;
			} else if (key == "emojis") {
				obj.options.legend.labels.fontSize = 30;
			}

			var dataset_sortable = [];

			for(var y=0;y<Object.keys(history[key]).length;y++) {
				var histKey = Object.keys(history[key])[y];
				var color = this.random_rgba();

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

			dataset_sortable = dataset_sortable.sort((a, b) => {return b.value - a.value}).map((sortable) => {return sortable.raw})
			.splice(0, spliceby);

			for(var z=0;z<dataset_sortable.length;z++) {
				console.log(z);
				if(this.colors[z] != undefined) {
					console.log(this.colors[z][0])
					dataset_sortable[z].backgroundColor = this.colors[z][0];
					dataset_sortable[z].borderColor = this.colors[z][0];
				} else {
					break;
				}
			}

			obj.data.datasets = dataset_sortable;

			charts[key] = obj;
		}

		return(charts);
	}
}

var title = $(document).attr('title');
var reference = "";

switch(title) {
	case "Daily": reference = "/daily_recent"; break;
	case "Weekly": reference = "/weekly_recent"; break;
	default: reference = "/single_recent"; break;
}
var chart;

$.ajax({
  url: `https://frogeye.duckdns.org${reference}`,
  dataType: "json",
  type: "GET",
}).done((res) => {
	chart = new timelineGraphHistory(res.data, title);
	chart.displayChart(chart.charts.hashtags)

}).fail((err) => {
	console.log(err);
})