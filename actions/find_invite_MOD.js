module.exports = {

	name: "Find Invite",

	section: "Invite Control",

	subtitle: function(data) {
		return `${data.invite}`;
	},

	author: "MrGold",

	version: "1.X.X",

	short_description: "Finds an invite by code or URL",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Invite']);
	},

	fields: ["invite", "storage", "varName"],

	html: function(isEvent, data) {
		return `
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by MrGold
			</p>
		</div><br>
	<div>
		<div style="padding-top: 8px;">
			Source Invite:<br>
			<textarea class="round" id="invite" rows="1" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div><br>
	</div>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const invite = this.evalMessage(data.invite, cache);
		const client = this.getDBM().Bot.bot;

		client.fetchInvite(invite).catch(this.displayError(data,cache,err)).then(doThis.bind(this));

		function doThis(invite){
	 	const storage = parseInt(data.storage);
     	const varName = this.evalMessage(data.varName, cache);
	 	this.storeValue(invite, storage, varName, cache);
	 	this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};