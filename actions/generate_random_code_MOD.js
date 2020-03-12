module.exports = {

name: "Generate Random Code",

section: "Other Stuff",

subtitle: function(data) {
	return `Code length ${(data.num)}`
},

github: "LeonZ2019/DBM",
author: "LeonZ",
version: "1.1.0",

variableStorage: function (data, varType) {
	const type = parseInt(data.storage);
	if (type !== varType) return;
	let dataType = 'Code';
	return ([data.varName, dataType]);
},

fields: ["num", "storage", "varName"],

html: function(isEvent, data) {
	return `
<div style="float: left; width: 100%;">
	Number:<br>
	<input id="num" class="round" type="text">
</div><br><br><br>
<div>
	<div style="float: left; width: 40%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="padding-left: 3%; float: left; width: 55%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`
},

init: function() {
},

action: function(cache) {
	const data = cache.actions[cache.index];
	const num = this.evalMessage(data.num, cache);
	let result;
	let key = "";
	if (num != 0 ) {
		while (key.length != num) {
			key += "Z";
		}
		const code = (parseInt(key,36)+1).toString(10);
		const basenum = parseInt(Math.floor(Math.random() * code),10);
		const result = basenum.toString(36).toUpperCase()
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result, storage, varName, cache);
	}
	this.callNextAction(cache);
},

mod: function(DBM) {
}

};
