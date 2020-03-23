module.exports = {

name: "Invite Delete MOD",

isEvent: true,

fields: ["Temp Variable Name (stores invite code that was deleted):"],

mod: function(DBM) {
	DBM.LeonZ = DBM.LeonZ || {};
	DBM.LeonZ.inviteDelete = function(invite) {
		const { Bot, Actions } = DBM;
		const events = Bot.$evts["Invite Delete MOD"];
		if(!events) return;
		const server = Bot.bot.guilds.cache.get(invite.guild_id);
		const temp = {};
		for (let i = 0; i < events.length; i++) {
			const event = events[i];
			if(event.temp) temp[event.temp] = invite.code;
			Actions.invokeEvent(event, server, temp);
		};
	};
	
	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("inviteDelete", DBM.LeonZ.inviteDelete);
		onReady.apply(this, ...params);
	}
}
}