module.exports = {

	name: "Control Server Data",

	section: "Deprecated",

	subtitle: function(data) {
		const channels = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${channels[parseInt(data.server)]} (${data.dataName}) ${data.changeType === "1" ? "+=" : "="} ${data.value}`;
	},

	fields: ["server", "varName", "dataName", "changeType", "value"],

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
		<div style="float: left; width: 50%;">
			Data Name:<br>
			<input id="dataName" class="round" type="text">
		</div>
		<div style="float: left; width: 45%;">
			Control Type:<br>
			<select id="changeType" class="round">
				<option value="0" selected>Set Value</option>
				<option value="1">Add Value</option>
			</select>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Value:<br>
		<input id="value" class="round" type="text" name="is-eval"><br>
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
		if(server && server.setData) {
			const dataName = this.evalMessage(data.dataName, cache);
			const isAdd = Boolean(data.changeType === "1");
			let val = this.evalMessage(data.value, cache);
			try {
				val = this.eval(val, cache);
			} catch(e) {
				this.displayError(data, cache, e);
			}
			if(val !== undefined) {
				if(isAdd) {
					server.addData(dataName, val);
				} else {
					server.setData(dataName, val);
				}
			}
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};