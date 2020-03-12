module.exports = {

	name: "Get List Length",

	section: "Lists and Loops",

	subtitle: function(data) {
		const list = ['Server Members', 'Server Channels', 'Server Roles', 'Server Emojis', 'All Bot Servers', 'Mentioned User Roles', 'Command Author Roles', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Get ${list[parseInt(data.list)]} Length`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'Number']);
	},

	fields: ["list", "varName", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source List:<br>
			<select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
				${data.lists[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.listChange(document.getElementById('list'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.list);
		const varName = this.evalMessage(data.varName, cache);
		const list = this.getList(storage, varName, cache);

		if(list && list.length) {
			const varName2 = this.evalMessage(data.varName2, cache);
			const storage2 = parseInt(data.storage);
			this.storeValue(list.length, storage2, varName2, cache);
		}

		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};