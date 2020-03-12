module.exports = {

	name: "Repeat String",

	author: "Armağan",

	version: "1.0.0",

	short_description: "Allows you to repeat text you want as much want.",

	section: "Other Stuff",

	subtitle: function(data) {
		return `${data.xtimes || "0"}x "${data.girdi || "None"}"`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Text']);
	},

	fields: ["storage", "varName", "girdi", "xtimes"],

	html: function(isEvent, data) {
		return `
	<div>
		<div>
			<u>Mod Info:</u><br>Created by Armağan!
		</div><br>
		<div>
			<div>
				String:<br>
				<input placeholder="String or varible" id="girdi" class="round" type="text">
			</div><br>
			<div>
				Times:<br>
				<input placeholder="Number or varible" id="xtimes" class="round" type="text">
			</div>
 		</div><br>
		<div>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text">
			</div>
	 	</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const girdi = this.evalMessage(data.girdi, cache);
		const xtimes = this.evalMessage(data.xtimes, cache);
		const storage = this.getVariable(type, varName, cache);
		const WrexMODS = this.getWrexMods();
		WrexMODS.CheckAndInstallNodeModule('repeat-string');
		const repeat = require('repeat-string');
		const result = repeat(girdi, xtimes);
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};