module.exports = {

	name: "Shuffle Word MOD",

	section: "Other Stuff",

	subtitle: function(data) {
    	const storage2 = ['','Temp Variable', 'Server Variable', 'Global Variable'];
		return `"${data.varName}" - ${storage2[parseInt(data.storage2)]} (${data.varName2})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName2, 'Text']);
	},

	fields: ["storage", "varName", "times", "storage2", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Variable:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="float: left; width: 60%;">
		Shuffle Times:<br>
		<input id="times" class="round" type="number">
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
    	const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const word = this.getVariable(storage, varName, cache);
		let times = parseInt(data.times);
		const list = [];
		for (var i = 0; i < word.length; i++) {
			list.push(word.charAt(i));
		}
		let result = "";
		if (!times) {
			times = 1;
		}
		for (; times > 0; times--) {
			list.sort(function(a, b){return 0.5 - Math.random()});
		}
		for (i = 0; i < list.length; i++) {
			result += list[i];
		}
		const varName2 = this.evalMessage(data.varName2, cache);
		const storage2 = parseInt(data.storage2);
		this.storeValue(result, storage2, varName2, cache);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};