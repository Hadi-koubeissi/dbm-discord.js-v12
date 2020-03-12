module.exports = {

	name: "Set Channel Permissions",

	section: "Channel Control",

	subtitle: function(data) {
		const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const index = parseInt(data.storage);
		return index < 3 ? `${names[index]}` : `${names[index]} - ${data.varName}`;
	},

	fields: ["storage", "varName", "permission", "state"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Channel:<br>
			<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 45%;">
			Permission:<br>
			<select id="permission" class="round">
				${data.permissions[0]}
			</select>
		</div>
		<div style="padding-left: 5%; float: left; width: 55%;">
			Change To:<br>
			<select id="state" class="round">
				<option value="0" selected>Allow</option>
				<option value="1">Disallow</option>
			</select>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.channelChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		if(!server) {
			this.callNextAction(cache);
			return;
		}
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getChannel(storage, varName, cache);

		const options = [];
		const option = {};
		if (parseInt(data.state) == 0) {
			option.allow = data.permission;
		} else {
			option.deny = data.permission;
		}
		option.id = server.id;
		options.push(option);

		if(Array.isArray(channel)) {
			this.callListFunc(channel, 'overwritePermissions', [options]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(channel && channel.overwritePermissions) {
			channel.overwritePermissions(options).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};