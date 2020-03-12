module.exports = {

	name: "Loop Start",

	section: "Lists and Loops",

	subtitle: function(data) {
		const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Loop start for ${storage[parseInt(data.storage)]} (${data.varName2})`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'Number']);
	},

	fields: ["storage", "varName", "loop", "storage2", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source List:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round varSearcher" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 94%;">
			Loop From:<br>
			<select id="loop" class="round">
				<option value="0" selected>Loop from Front</option>
				<option value="1">Loop from End</option>
			</select>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {

		glob.refreshVariableList(document.getElementById('storage'));

	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const loop = this.getVariable(1, "_loop", cache);
		if (loop && (loop[0] == 0 || loop[0] == 1)) {
			this.callNextAction(cache);
		} else {
			const varName = this.evalMessage(data.varName, cache);
			const storage = parseInt(data.storage);
			const list = this.getVariable(storage, varName, cache);
			const length = list.length;
			if (length) {
				const loop = parseInt(data.loop);
				const info = [];
				let result;
				info.push(loop)
				if (loop == 0) {
					result = 0;
					info.push(length);
				} else {
					info.push(0);
					result = length - 1;
				}
				const action = cache.index + 1
				info.push(action)
				this.storeValue(info, 1, "_loop", cache);
				const varName2 = this.evalMessage(data.varName2, cache);
				const storage2 = parseInt(data.storage2);
				this.storeValue(result, storage2, varName2, cache);
			}
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};