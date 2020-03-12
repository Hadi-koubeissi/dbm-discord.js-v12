module.exports = {

	name: "Delete Role",

	section: "Role Control",

	subtitle: function(data) {
		const names = ['Mentioned Role', '1st Author Role', '1st Server Role', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const index = parseInt(data.storage);
		return data.storage === "0" ? `${names[index]}` : `${names[index]} - ${data.varName}`;
	},

	fields: ["storage", "varName", "reason"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Role:<br>
			<select id="storage" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
				${data.roles[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div>
		Reason:<br>
		<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.roleChange(document.getElementById('storage'), 'varNameContainer')
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const role = this.getRole(storage, varName, cache);
		let reason;
		if (data.reason) {
			reason = this.evalMessage(data.reason, cache);
		};
		if(Array.isArray(role)) {
			this.callListFunc(role, 'delete', [reason]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(role && role.delete) {
			role.delete(reason).then(function(role) {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};