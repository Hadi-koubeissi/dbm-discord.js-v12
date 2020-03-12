module.exports = {

name: "Loop End",

section: "Lists and Loops",

subtitle: function(data) {
	const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `Loop end for ${storage[parseInt(data.storage)]} (${data.varName})`;
},

github: "LeonZ2019/DBM",
author: "LeonZ",
version: "1.1.0",

fields: ["storage", "varName"],

html: function(isEvent, data) {
	return `
<div>
	<div style="float: left; width: 35%;">
		Source Number:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div>`
},

init: function() {

	glob.refreshVariableList(document.getElementById('storage'));

},

action: function(cache) {
	const data = cache.actions[cache.index];
	const varName = this.evalMessage(data.varName, cache);
	const storage = parseInt(data.storage);
	const result = this.getVariable(storage, varName, cache);
	let item = parseInt(result);
	const info = this.getVariable(1,"_loop", cache);
	if (info[0] == -1) {
		console.log("Loop doesn't start");
	} else if (info[0] == 0) {
		if (item == info[1]-1) {
			info[0] = -1;
			this.storeValue(info, 1, "_loop", cache);
		} else {
			item++
			this.storeValue(item, storage, varName, cache)
			cache.index = Math.max(info[2] - 1, 0) - 1;
		}
	} else if (info[0] == 1) {
		if (item == info[1]) {
			info[0] = -1;
			this.storeValue(info, 1, "_loop", cache);
		} else {
			item--
			this.storeValue(item, storage, varName, cache)
			cache.index = Math.max(info[2] - 1, 0) - 1;
		}
	}
	this.callNextAction(cache);
},

mod: function(DBM) {
}

};