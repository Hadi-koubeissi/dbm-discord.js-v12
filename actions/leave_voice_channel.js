module.exports = {

	name: "Leave Voice Channel",

	section: "Audio Control",

	subtitle: function(data) {
		return 'The bot leaves voice channel.';
	},

	fields: [],

	html: function(isEvent, data) {
		return '';
	},

	init: function() {
	},

	action: function(cache) {
		const server = cache.server;
		if(server && server.me.voice.channel) {
			server.me.voice.channel.leave();
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};