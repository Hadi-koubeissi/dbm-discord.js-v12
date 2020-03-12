module.exports = {

	name: "Set Bot AFK Status",

	section: "Bot Client Control",

	subtitle: function(data) {
		return `${data.afk === "0" ? "AFK" : "Not AFK"}`;
	},

	fields: ["afk"],

	html: function(isEvent, data) {
		return `
	<div style="float: left; width: 80%;">
		AFK Status:<br>
		<select id="status" class="round">
			<option value="0">AFK</option>
			<option value="1">Not AFK</option>
		</select>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const botClient = this.getDBM().Bot.bot.user;
		const data = cache.actions[cache.index];
		const afk = parseInt(data.afk);
		if(botClient && botClient.setAFK) {
			botClient.setAFK(Boolean(afk === "0")).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};