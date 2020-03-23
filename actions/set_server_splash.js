module.exports = {

	name: "Set Server Splash Screen",

	section: "Server Control",

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storeTypes[parseInt(data.storage)]} (${data.varName2})`;
	},

	fields: ["server", "varName", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<p>
			<u>Note:</u><br>
			Discord Splash Screens are only available to Discord Partners.<br>
			For more information, check out <a href="#" onclick="glob.openLink('https://discordapp.com/partners')">https://discordapp.com/partners</a>.
		</p>
	</div><br>
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
		<div style="float: left; width: 35%;">
			Source Image:<br>
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
		if(Array.isArray(server) || (server && server.setSplash)) {
			const type = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			const img = this.getVariable(type, varName2, cache);

			const CanvasJS = this.getDBM().CanvasJS;
			const buffer = CanvasJS.toBuffer(img);
			if(Array.isArray(server)) {
				this.callListFunc(server, 'setSplash', [buffer]).then(function() {
					this.callNextAction(cache);
				}.bind(this));
			} else {
				server.setSplash(buffer).then(function() {
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
			}
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};