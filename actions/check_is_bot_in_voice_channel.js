module.exports = {

	name: "Check is Bot in Voice Channel",

	section: "Conditions",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
	<div>
		${data.conditions[0]}
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.onChangeTrue(document.getElementById('iftrue'));
		glob.onChangeFalse(document.getElementById('iffalse'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const result = cache.server ? !!Audio.connections[cache.server.id] : false;
		this.executeResults(result, data, cache);
	},

	mod: function(DBM) {
	}

};