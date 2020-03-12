module.exports = {

	name: "Create Role",

	section: "Role Control",

	subtitle: function(data) {
		return `${data.roleName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Role']);
	},

	fields: ["roleName", "hoist", "mentionable", "color", "position", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	Name:<br>
	<input id="roleName" class="round" type="text"><br>
	<div style="float: left; width: 50%;">
		Display Separate from Online Users:<br>
		<select id="hoist" class="round" style="width: 90%;">
			<option value="true">Yes</option>
			<option value="false" selected>No</option>
		</select><br>
		Mentionable:<br>
		<select id="mentionable" class="round" style="width: 90%;">
			<option value="true" selected>Yes</option>
			<option value="false">No</option>
		</select><br>
	</div>
	<div style="float: right; width: 50%;">
		Color:<br>
		<input id="color" class="round" type="text" placeholder="Leave blank for default!"><br>
		Position:<br>
		<input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
	</div>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const options = {};
		options.data = {};
		if(data.roleName) {
			options.data.name = this.evalMessage(data.roleName, cache);
		}
		if(data.color) {
			options.data.color = this.evalMessage(data.color, cache);
		}
		if(data.position) {
			options.data.position = parseInt(data.position);
		}
		options.data.hoist = JSON.parse(data.hoist);
		options.data.mentionable = JSON.parse(data.mentionable);
		if(server && server.roles.create) {
			server.roles.create(options).then(function(role) {
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(role, storage, varName, cache);
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};