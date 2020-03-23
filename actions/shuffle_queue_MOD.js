module.exports = {

	name: "Shuffle Queue MOD",

	section: "Audio Control",

	subtitle: function(data) {
		const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Shuffle Queue of ${servers[parseInt(data.server)]}`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	fields: ["server", "varName"],

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
		</div>
	</div>`
	},

	init: function () {
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
		Audio.shuffleQueue(targetServer.id);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};