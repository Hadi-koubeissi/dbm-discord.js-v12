module.exports = {

	name: "Set Member Channel Perms",

	section: "Channel Control",

	subtitle: function(data) {
		const names = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const index = parseInt(data.channel);
		return index < 3 ? `${names[index]}` : `${names[index]} (${data.varName})`;
	},

	fields: ["channel", "varName", "member", "varName2", "permission", "state"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Channel:<br>
			<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Source Member:<br>
			<select id="member" name="second-list" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
				${data.members[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text" list="variableList2"><br>
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
				<option value="1">Inherit</option>
				<option value="2">Disallow</option>
			</select>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.channelChange(document.getElementById('channel'), 'varNameContainer');
		glob.memberChange(document.getElementById('member'), 'varNameContainer2');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.channel);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getChannel(storage, varName, cache);
		const storage2 = parseInt(data.member);
		const varName2 = this.evalMessage(data.varName2, cache);
		const member = this.getMember(storage2, varName2, cache);

		const options = [];
		const option = {};
		if (parseInt(data.state) == 0) {
			option.allow = data.permission;
		} else if (parseInt(data.state) == 1) {
			option.deny = data.permission;
		} else {
			option.null = data.permission;
		}
		option.id = member.id;
		options.push(option);

		if(member && member.id) {
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
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};