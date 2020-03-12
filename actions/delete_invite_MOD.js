module.exports = {

	name: "Delete Invite",

	section: "Channel Control",

	subtitle: function(data) {
		return `delete invite ${data.inviteCode}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'Text']);
	},

	fields: ["invite", "reason"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="padding-top: 8px;">
			Source Invite:<br>
			<textarea class="round" id="inviteCode" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div>
	</div><br><br><br>
	<div>
		Reason:<br>
		<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		
		const reason = this.evalMessage(data.reason, cache);
		client.fetchInvite(invite).then(invite => {
			if (reason) {
				invite.delete(reason);
			} else {
				invite.delete;
			};
			this.callNextAction(cache);
		}).catch(err => {
			this.displayError(data, cache, err);
		});
	},

	mod: function(DBM) {
	}

};