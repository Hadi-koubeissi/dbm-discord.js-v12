module.exports = {

	name: "Set Member Permissions",

	section: "Member Control",

	subtitle: function(data) {
		const channels = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${channels[parseInt(data.member)]}`;
	},

	fields: ["member", "varName", "permission", "action"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Member:<br>
			<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
				${data.members[isEvent ? 1 : 0]}
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
				${data.permissions[2]}
			</select>
		</div>
		<div style="float: right; width: 50%;">
			Action:<br>
			<select id="action" class="round">
				<option value="0" selected>Add</option>
				<option value="1">Remove</option>
			</select>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.memberChange(document.getElementById('member'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(storage, varName, cache);
		const funcName = data.action === "0" ? "add" : "remove";
		if(member && member.permissions) {
			member.permissions[funcName](data.permission).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};