module.exports = {

	name: "Set Server Name",

	section: "Server Control",

	subtitle: function(data) {
		return `${data.serverName}`;
	},

	fields: ["server", "varName", "serverName"],

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
	<div style="padding-top: 8px; width: 90%;">
		Server Name:<br>
		<input id="serverName" class="round" type="text">
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
		if(Array.isArray(server)) {
			this.callListFunc(server, 'setName', [this.evalMessage(data.serverName, cache)]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(server && server.setName) {
			server.setName(this.evalMessage(data.serverName, cache)).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};