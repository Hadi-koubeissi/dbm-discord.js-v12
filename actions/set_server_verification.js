module.exports = {

	name: "Set Server Verification",

	section: "Server Control",

	subtitle: function(data) {
		const verifications = ['None', 'Low', 'Medium', '(╯°□°）╯︵ ┻━┻', '┻━┻彡 ヽ(ಠДಠ)ノ彡┻━┻﻿'];
		return `${verifications[parseInt(data.verification)]}`;
	},

	fields: ["server", "varName", "verification"],

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
		Verification Level:<br>
		<select id="verification" class="round">
			<option value="0">None</option>
			<option value="1">Low</option>
			<option value="2">Medium</option>
			<option value="3">(╯°□°）╯︵ ┻━┻ (High)</option>
			<option value="4">┻━┻彡 ヽ(ಠДಠ)ノ彡┻━┻﻿ (Very High)</option>
		</select>
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
			this.callListFunc(server, 'setVerificationLevel', [parseInt(data.verification)]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(server && server.setVerificationLevel) {
				server.setVerificationLevel(parseInt(data.verification)).then(function() {
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};