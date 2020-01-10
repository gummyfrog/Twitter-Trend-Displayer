// $.ajax({
//   url: `https://frogeye.duckdns.org/active`,
//   dataType: "json",
//   type: "GET",
// }).done((data) => {
// 	console.log(data.active);
// 	var element = document.getElementById("sidebar-activity");
// 	for(var x=0;x<data.active.length;x++) {
// 		var track = data.active[x] == "." ? "Snapshot" : data.active[x];

// 		if(track.length > 15) {
// 			track = track.substr(0, 15) + "..."
// 		}
// 		element.innerHTML += `<div class="dripcss"><div></div> <div></div></div> <p style="display: inline">${track}</p>`
// 	}
// 	$.ajax({
// 	  url: `https://frogeye.duckdns.org/storage`,
// 	  dataType: "json",
// 	  type: "GET",
// 	}).done((data) => {
// 		console.log(data.storage);
// 		var element = document.getElementById("sidebar-activity");
// 		element.innerHTML += `<p style="display: inline">${data.storage["single"]} Snapshots Stored.</p>`

// 	}).fail((err) => {
// 		console.log(err);
// 	})
// }).fail((err) => {
// 	console.log(err);
// })

