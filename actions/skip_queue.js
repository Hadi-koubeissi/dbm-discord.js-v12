module.exports = {

	name: "Skip Queue",

	section: "Audio Control",

	subtitle: function(data) {
		const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Skip ${data.amount} Items of ${servers[parseInt(data.server)]}`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	fields: ["server", "varName", "amount"],

	html: function(isEvent, data) {
		return `
	<div>
	<div style="float: left; width: 35%;">
		Source Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 95%;">
			<br>Amount to Skip:<br>
			<input id="amount" class="round" value="1">
		</div>
	</div>`
	},

	init: function() {
		const { glob, document } = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer')
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const targetServer = this.getServer(server, varName, cache);
		if (!targetServer) {
			this.callNextAction(cache);
			return;
		};
		const amount = parseInt(this.evalMessage(data.amount, cache));
		Audio.skipQueue(amount, targetServer.id);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};