module.exports = {

	name: "Store Ban Info MOD",

	section: "Member Control",

	subtitle: function(data) {
		const info = ['Executor Member Object', 'Banned Member Object', 'Reason', 'Banned Date', 'Banned Timestamp', 'Total Banned Count'];
		return `${data.member} - ${info[data.info]}`;
	},


	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	variableStorage: function(data, varType) {
		const info = parseInt(data.info);
		let dataType;
		switch(info) {
			case 0:
			case 1:
				dataType = "Member Object";
				break;
			case 2:
				dataType = 'Text';
				break;
			case 3:
				dataType = 'Date';
				break;
			case 4:
			case 5:
				dataType = 'Number';
				break;
		}
		return ([data.varName, dataType]);
	},

	fields: ["info", "member", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 94%;">
			Source Info:<br>
			<select id="info" class="round" onchange="glob.onChange0(this)">
				<option value="0" selected>Executor User Object</option>
				<option value="1">Banned User Object</option>
				<option value="2">Reason</option>
				<option value="3">Banned Date</option>
				<option value="4">Banned Timestamp</option>
				<option value="5">Total Banned Count (Included Bot)</option>
			</select><br>
		</div>
	</div><br><br><br>
	<div>
		<div id="Input0" style=" display: none; float: left; width: 104%;">
			Banned Member ID / Username:<br>
			<input id="member" class="round" type="text"><br>
		</div>
	</div>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select><br>
		</div>
		<div style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;
		const Input0 = document.getElementById('Input0');

		glob.onChange0 = function(info) {
			if (parseInt(info.value) == 5) {
				Input0.style.display = 'none';
			} else {
				Input0.style.display = null;
			}
		}

		glob.onChange0(document.getElementById('info'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const member = this.evalMessage(data.member, cache);
		const info = parseInt(data.info);
		const server = cache.server;
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		let result;
		if (info !== 5) {
			let options = {};
			options.type = 22;
			server.fetchAuditLogs(options).then(Audits => {
				let banned = Audits.entries.find(user => (user.target.id === member || user.target.username === member))
				switch(info) {
					case 0:
						result = banned.executor;
						break;
					case 1:
						result = banned.target;
						break;
					case 2:
						result = banned.reason;
						break;
					case 3:
						result = banned.createdAt;
						break;
					case 4:
						result = banned.createdTimestamp;
						break;
				}
				if (result !== undefined) {
					this.storeValue(result, storage, varName, cache);
				}
				this.callNextAction(cache);
			})

		} else {
			server.fetchBans().then(Bans => {
				result = Bans.size;
				if (result !== undefined) {
					this.storeValue(result, storage, varName, cache);
				}
				this.callNextAction(cache);
			})
		}
	},

	mod: function(DBM) {
	}

};