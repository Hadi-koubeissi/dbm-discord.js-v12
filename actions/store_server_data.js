module.exports = {

	name: "Store Server Data",

	section: "Deprecated",

	subtitle: function(data) {
		const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${servers[parseInt(data.server)]} - ${storage[parseInt(data.storage)]} (${data.varName2})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'Unknown Type']);
	},

	fields: ["server", "varName", "dataName", "defaultVal", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Server:<br>
			<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
				${data.servers[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 40%;">
			Data Name:<br>
			<input id="dataName" class="round" type="text">
		</div>
		<div style="float: left; width: 60%;">
			Default Value (if data doesn't exist):<br>
			<input id="defaultVal" class="round" type="text" value="0">
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
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const server = this.getServer(type, varName, cache);
		if(server && server.data) {
			const dataName = this.evalMessage(data.dataName, cache);
			const defVal = this.eval(this.evalMessage(data.defaultVal, cache), cache);
			let result;
			if(defVal === undefined) {
				result = server.data(dataName);
			} else {
				result = server.data(dataName, defVal);
			}
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};