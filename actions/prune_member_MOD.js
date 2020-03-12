module.exports = {

	name: "Prune Member MOD",

	section: "Member Control",

	subtitle: function(data) {
		return `Since ${data.day} Days Ago`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		let dataType = 'Number';
		return ([data.varName, dataType]);
	},

	fields: ["days", "reason", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Day Since (1-30):<br>
			<input id="days" class="round" type="text">
		</div>
	</div><br><br><br>
	<div>
		<div style="padding-top: 8px;">
			Reason:<br>
			<textarea id="reason" rows="2" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div>
	<div><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const days = parseInt(this.evalMessage(data.days, cache));
		const reason = this.evalMessage(data.reason, cache);
		const server = cache.server;
		const options = {};
		if (!day) {
			this.callNextAction(cache);
			return;
		}
		options.days = days;
		if (parseInt(data.dry) == 0) {
			options.dry = true;
		} else {
			options.dry = false;
		}
		options.count = true;
		if (reason) {
			options.reason = reason;
		}
		server.members.prune(options).then(pruned => {
			if (pruned != null) {
				const storage = parseInt(data.storage);
				const varName = this.evalMessage(data.varName, cache);
				this.storeValue(pruned, storage, varName, cache);
			}
			this.callNextAction(cache);
		}).catch(err => {
			this.displayError(data, cache, err);
		})
	},

	mod: function(DBM) {
	}

};