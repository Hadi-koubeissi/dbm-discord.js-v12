module.exports = {

	name: "Kick Member",

	section: "Member Control",

	subtitle: function(data) {
		const members = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${members[parseInt(data.member)]}`;
	},

	fields: ["member", "varName", "reason"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Member:<br>
			<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
				${data.members[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div>
	<br><br><br>
	<div style="padding-top: 8px;">
		Reason:<br>
		<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.memberChange(document.getElementById('member'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);
		if(Array.isArray(member)) {
			this.callListFunc(member, 'kick', [this.evalMessage(data.reason, cache)]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(member && member.kick) {
			member.kick(this.evalMessage(data.reason, cache)).then(function(member) {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};