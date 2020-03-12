module.exports = {

	name: "Set Bot Username",

	section: "Bot Client Control",

	subtitle: function(data) {
		return `${data.username}`;
	},

	fields: ["username"],

	html: function(isEvent, data) {
		return `
	<div>
		<p>
			Change username only 2 requests every hour. Use this sparingly!
		</p>
	</div>
	<div style="width: 90%;">
		Username:<br>
		<input id="username" class="round" type="text">
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const botClient = this.getDBM().Bot.bot.user;
		const data = cache.actions[cache.index];
		const username = this.evalMessage(data.username, cache);
		if(botClient && botClient.setUsername) {
			botClient.setUsername(username).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};