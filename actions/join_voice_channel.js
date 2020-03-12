module.exports = {

	name: "Join Voice Channel",

	section: "Audio Control",

	subtitle: function(data) {
		const channels = ['Command Author\'s Voice Ch.', 'Mentioned User\'s Voice Ch.', 'Default Voice Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${channels[parseInt(data.channel)]}`;

	},

	fields: ["channel", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 45%;">
			Voice Channel:<br>
			<select id="channel" class="round" onchange="glob.voiceChannelChange(this, 'varNameContainer')">
				${data.voiceChannels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 50%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div>`;
	},

	init: function() {
		const {glob, document} = this;

		glob.voiceChannelChange(document.getElementById('channel'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const type = parseInt(data.channel);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getVoiceChannel(type, varName, cache);
		if(channel !== undefined) {
			Audio.connectToVoice(channel).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else {
			this.callNextAction(cache);
		}
	},

	requiresAudioLibraries: true,

	mod: function(DBM) {
	}

};