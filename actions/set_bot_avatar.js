module.exports = {

	name: "Set Bot Avatar",

	section: "Bot Client Control",

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storeTypes[parseInt(data.storage)]} (${data.varName})`;
	},

	fields: ["storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 45%;">
			Source Image:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 50%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const botClient = this.getDBM().Bot.bot.user;
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const image = this.getVariable(storage, varName, cache);
		const CanvasJS = this.getDBM().CanvasJS;
		const buffer = CanvasJS.toBuffer(image);
		if(botClient && botClient.setAvatar) {
			botClient.setAvatar(buffer).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};