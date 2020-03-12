module.exports = {

	name: "Ban Member",

	section: "Member Control",

	subtitle: function(data) {
		const channels = ['Mentioned User', 'Command Author', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${channels[parseInt(data.member)]}`;
	},

	fields: ["member", "amount","varName", "reason"],

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
	</div><br><br><br>
	<div>
		<div style="float: left; width 60%;">
			Number of days of message to delete:<br>
			<input id="amount" class="round" type="text"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Reason:<br>
		<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.memberChange(document.getElementById('member'), 'varNameContainer')
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);
		const reason = this.evalMessage(data.reason, cache);
		const amount = parseInt(this.evalMessage(data.amount, cache));
		let options;
		if (amount && !isNaN(amount)) {
			options.days = amount;
		};
		if (reason) {
			options.reason = reason;
		};
		if(Array.isArray(member)) {
			this.callListFunc(member, 'ban', [options]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(member && member.ban) {
			member.ban(options).then(function(member) {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};