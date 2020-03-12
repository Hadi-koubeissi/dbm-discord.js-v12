module.exports = {

	name: "Delete Webhook",

	section: "Webhook Control",

	subtitle: function(data) {
		const names = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${names[parseInt(data.webhook)]} - ${data.varName}`;
	},

	author: "MrGold",

	version: "1.X.X",

	short_description: "Delete a Specific Webhook",

	depends_on_mods: [{name:'WrexMods',path:'aaa_wrexmods_dependencies_MOD.js'}],

	fields: ["webhook", "varName", "reason"],

	html: function(isEvent, data) {
		return `
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by MrGold
			</p>
	</div><br>
		<div style="float: left; width: 35%;">
			Source Webhook:<br>
			<select id="webhook" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
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

		glob.refreshVariableList(document.getElementById('webhook'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.webhook);
		const varName = this.evalMessage(data.varName, cache);
		var WrexMods = this.getWrexMods();
		const webhook = WrexMods.getWebhook(storage, varName, cache);
		let reason;
		if (data.reason) {
			reason = this.evalMessage(data.reason, cache);
		};
		if(Array.isArray(webhook)) {
			this.callListFunc(webhook, 'delete', [reason]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(webhook && webhook.delete) {
			webhook.delete(reason).then(function(webhook) {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};