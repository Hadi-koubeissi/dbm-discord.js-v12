module.exports = {

	name: "Set Member Nickname",

	section: "Member Control",

	subtitle: function(data) {
		const channels = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${channels[parseInt(data.member)]} - ${data.nickname}`;
	},

	fields: ["member", "varName", "nickname"],

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
	</div>
	<br><br><br>
	<div style="padding-top: 8px;">
		New Nickname:<br>
		<input id="nickname" class="round" type="text"><br>
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
			this.callListFunc(member, 'setNickname', [this.evalMessage(data.nickname, cache)]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(member && member.setNickname) {
			member.setNickname(this.evalMessage(data.nickname, cache)).then(function(member) {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};