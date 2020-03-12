module.exports = {
name: "Check Channel Role Permission",

section: "Channel Control",

subtitle: function(data) {
	const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
	return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
},

//WTF?? FUCK THIS
github: "LeonZ2019/DBM",
author: "LeonZ",
version: "1.1.0",

fields: ["channel", "varName", "role", "varName2", "permission", "state", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

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
		Source Role:<br>
		<select id="role" class="round" name="second-list" onchange="glob.roleChange(this, 'varNameContainer2')">
			${data.roles[isEvent ? 1 : 0]}
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
		Compare To:<br>
		<select id="state" class="round">
			<option value="0" selected>Allow</option>
			<option value="1">Inherit</option>
			<option value="2">Disallow</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`
},

init: function() {
	const {glob, document} = this;

		glob.onChange1 = function(event) {
		if(event.value === "0") {
			document.getElementById("directValue").style.display = 'none';
		} else {
			document.getElementById("directValue").style.display = null;
		}
	};

	glob.channelChange(document.getElementById('channel'), 'varNameContainer');
	glob.roleChange(document.getElementById('role'), 'varNameContainer2');
	glob.onChangeTrue(document.getElementById('iftrue'));
	glob.onChangeFalse(document.getElementById('iffalse'));
},

action: function(cache) {
	const permission = require('discord.js');
	const data = cache.actions[cache.index];
	const storage = parseInt(data.channel);
	const varName = this.evalMessage(data.varName, cache);
	const channel = this.getChannel(storage, varName, cache);

	const storage2 = parseInt(data.role);
	const varName2 = this.evalMessage(data.varName2, cache);
	const role = this.getRole(storage2, varName2, cache);

	const options = {};
	options[data.permission] = data.state === "0" ? true : (data.state === "2" ? false : null);
	const permissions = permission(6144);
	let result = false;
	if(role && role.id) {
		if(Array.isArray(channel)) {
			this.callListFunc(channel, 'overwritePermissions', [role.id, options]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(channel && channel.PermissionResolvable) {
			result = Boolean(channel.PermissionOverwrites(role.id, options)==data.state)
		}
	}
	this.executeResults(result, data, cache);
},

mod: function(DBM) {
}

};