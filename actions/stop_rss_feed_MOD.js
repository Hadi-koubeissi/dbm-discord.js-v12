module.exports = {

	name: "Stop RSS Feed Watcher",

	section: "Other Stuff",

	subtitle: function (data) {
		return `${data.url}`;
	},

	author: "Two",

	version: "1.9.3",

	short_description: "This mod allows you to stop a watch rss feed",

	variableStorage: function (data, varType) {
	},

	fields: ["storage", "varName"],

	html: function (isEvent, data) {
		return `
		<div>
	<div style="float: left; width: 35%;">
		RSS Feed Source:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>`
	},

	init: function () {},

	action: function (cache) {
		const data = cache.actions[cache.index];
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		var stor = storage + varName
		const res = this.getVariable(storage, stor, cache);
			res.stop()
			this.callNextAction(cache);
		

	},

	mod: function (DBM) {}

};