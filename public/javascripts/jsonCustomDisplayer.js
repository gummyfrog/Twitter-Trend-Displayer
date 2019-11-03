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

	makeboxes(_arr, _classes, _count) {
		var ret = [];
		for(var x=0;x<_count;x++) {
			if(_arr[x] == undefined) break;
			ret.push(`
				<div class=${_classes[0]}>
					<p class=${_classes[1]}>${_arr[x].key}</p>
					<p class=${_classes[2]}>${_arr[x].value}</p>
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

		<div class="card" style="${puddle.track=='.' ? "width: 100% !important;" : ""} background-color: ${bg}; margin-left: ${depth*40}px">
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
					<div class="emoji_box">
						<p class="emoji_key" style="font-size: 35px"> ${data.emojis[0].key} </p>
						<p class="emoji_value" style="font-size: 20px; color: ${fg}"> ${data.emojis[0].value} </p>
					</div>
					<div class="emoji_box">
						<p class="emoji_key" style="font-size: 30px"> ${data.emojis[1].key} </p>
						<p class="emoji_value" style="font-size: 15px; color: ${fg}"> ${data.emojis[1].value} </p>
					</div>
					<div class="emoji_box">
						<p class="emoji_key" style="font-size: 30px"> ${data.emojis[2].key} </p>
						<p class="emoji_value" style="font-size: 15px; color: ${fg}"> ${data.emojis[2].value} </p>
					</div>
				</div>
				<p class="title" style="color: ${fg}"> Aggregate </p>
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
		this.card(puddle, depth);
		for(var x=0;x<puddle.children.length;x++) {
			var next = puddle.children[x];
			this.puddle_loop(next, depth+1);
		}
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

$.ajax({
  url: `https://frogeye.duckdns.org:8100${reference}`,
  dataType: "json",
  type: "GET",
}).done((res) => {
	if(title == "Recent") {
		var obj = res.data;
		displayer.puddle_loop(obj);
	} else {
		console.log(res);
		displayer.daily(res.data, 0)
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
