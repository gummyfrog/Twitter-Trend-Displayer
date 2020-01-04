class Carder {

	constructor() {

		this.element = document.getElementById("cards");

		this.colors = {
			1: ["#5F369B"],
			2: ["#57328d"],
			3: ["#4e2d7f"],
			4: ["#462871"],

			5: ["#2B2565"],
			6: ["#251f54"],
			7: ["#1e1943"],
			8: ["#1a163b"],
			9: ["#EE4035"],
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


	total_children(puddle) {
		var count = 0;
		for(var c=0;c<puddle.children.length;c++) {
			count += 1;
			count += this.total_children(puddle.children[c]);
		}
		return count;
	}

	card(puddle, depth) {
		var fg = "#fff"
		var bg;

		if(depth==0) {
			fg = "var(--header-background-color);"
			bg = "var(--header-text-color);"
		} else {
			bg = this.colors[depth][0];
		}

		var card = `
		<div class="shadow" style="background-color: ${bg}; margin-top: 50px; margin-left: ${depth*40}px; height:${((this.total_children(puddle) || 0) * 144) +60}px"></div>

		<div class="card" style="color:${fg}; ${puddle.track=='.' ? "width: 100% !important;" : ""} background-color: ${bg}; margin-left: ${depth*40}px">
			<div class=card_title_box>
				<p class="card_emoji" style="text-shadow: -5px 5px ${fg}"> ${this.gettop(puddle.emojis, 2)} </p>
				<p class="card_title"> ${puddle.track == '.' ? `Snapshot at ${moment(puddle.start_time).format('LLLL')}` : puddle.track} </p>
				<p class="card_subtitle"> ${this.gettop(puddle.words, 6, ", ")} </p>
			</div>

			<div class=card_info_box>
				<p class="card_hashtag_child"> ${this.gettop(puddle.hashtags, 3," ")} </p>
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


$.ajax({
  url: `https://frogeye.duckdns.org/single_recent`,
  dataType: "json",
  type: "GET",
}).done((res) => {
	var obj = res.data;
	displayer.puddle_loop(obj);

}).fail((err) => {
	console.log(err);
})