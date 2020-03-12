module.exports = {

	name: "Clear Queue",

	section: "Audio Control",

	subtitle: function(data) {
		return 'The queue is cleared.';
	},

	fields: [],

	html: function(isEvent, data) {
		return '';
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = cache.server;
		Audio.removeQueue(server.id);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};