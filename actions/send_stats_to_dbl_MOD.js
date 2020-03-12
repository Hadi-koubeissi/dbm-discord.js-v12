module.exports = {

	name: "Sends Stats to DBL",

	section: "Other Stuff",

	subtitle: function (data) {
		const info = ['Only Server Count', 'Shard & Server Count'];
		return `Send ${info[parseInt(data.info)]} to DBL!`;
	},

	author: "EGGSY",

	version: "1.9.2",

	short_description: "Send bot stats to Discord Bot List!",

	fields: ["dblToken", "info"],

	html: function (isEvent, data) {
		return `
	<div id="modinfo">
		<p>
	   	<u>Mod Info:</u><br>
	   	Made by EGGSY!<br>
		</p>
		<div style="float: left; width: 99%; padding-top: 8px;">
	   	Your DBL Token:<br>
	   	<input id="dblToken" class="round" type="text">
		</div><br>
		<div style="float: left; width: 90%; padding-top: 8px;">
	   	Info to Send:<br>
	   	<select id="info" class="round">
			<option value="0">Send Server Count Only</option>
			<option value="1">Send Shard & Server Count</option>
		</select><br>
		<p>
			• Use this mod inside events or commands<br>
			• Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
		</p>
		</div>
	</div>`
	},

	init: function () {
	},

	action: function (cache) {
		const data = cache.actions[cache.index],
			token = this.evalMessage(data.dblToken, cache),
			info = parseInt(data.info),
			snek = require("snekfetch");

		switch (info) {
			case 0:
				snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
					.set("Authorization", token)
					.send({ server_count: this.getDBM().Bot.bot.guilds.cache.size })
					.catch(this.displayError.bind(this, data, cache))
				break;
			case 1:
				if (this.getDBM().Bot.bot.shard != null) {
					snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
						.set("Authorization", token)
						.send({ server_count: this.getDBM().Bot.bot.guilds.cache.size, shard_id: this.getDBM().Bot.bot.shard.id })
						.catch(this.displayError.bind(this, data, cache))
					break;
				} else {
					snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
						.set("Authorization", token)
						.send({ server_count: this.getDBM().Bot.bot.guilds.cache.size })
						.catch(this.displayError.bind(this, data, cache))
				}
		}

		this.callNextAction(cache);
	},

	mod: function (DBM) {
	}

};
