module.exports = {

	commandOnly: true,

	name: "Store Command Params",

	section: "Other Stuff",

	subtitle: function(data) {
		const infoSources = ['One Parameter', 'Multiple Parameters', 'Mentioned Member', 'Mentioned Role', 'Mentioned Channel']
		return `${infoSources[parseInt(data.info)]} #${data.infoIndex}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'None';
		switch(info) {
			case 0:
			case 1:
				dataType = "Text";
				break;
			case 2:
				dataType = "Server Member";
				break;
			case 3:
				dataType = "Role";
				break;
			case 4:
				dataType = "Channel";
				break;
		}
		return ([data.varName, dataType]);
	},

	fields: ["info", "infoIndex", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Info:<br>
			<select id="info" class="round" onchange="glob.onChange1(this)">
				<option value="0" selected>One Parameter</option>
				<option value="1">Multiple Parameters</option>
				<option value="2">Mentioned Member</option>
				<option value="3">Mentioned Role</option>
				<option value="4">Mentioned Channel</option>
			</select>
		</div>
		<div style="float: right; width: 60%;">
			<div id="infoCountLabel">Parameter Number:</div>
			<input id="infoIndex" class="round" type="text" value="1"><br>
		</div>
	</div><br><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const infoCountLabel = document.getElementById("infoCountLabel");
			switch(value) {
				case 0:
					infoCountLabel.innerHTML = 'Parameter Number:';
					break;
				case 1:
					infoCountLabel.innerHTML = 'Starting From Parameter Number:';
					break;
				case 2:
					infoCountLabel.innerHTML = 'Member Mention Number:';
					break;
				case 3:
					infoCountLabel.innerHTML = 'Role Mention Number:';
					break
				case 4:
					infoCountLabel.innerHTML = 'Channel Mention Number:';
					break;
				default:
					infoCountLabel.innerHTML = '';
					break;
			}
		};

		glob.onChange1(document.getElementById('info'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const msg = cache.msg;
		const infoType = parseInt(data.info);
		const index = parseInt(this.evalMessage(data.infoIndex, cache));
		const separator = this.getDBM().Files.data.settings.separator || '\\s+';
		let source;
		switch(infoType) {
			case 0:
				if(msg && msg.content) {
					const params = msg.content.split(new RegExp(separator));
					source = params[index] || '';
				}
				break;
			case 1:
				if(msg && msg.content) {
					const params = msg.content.split(new RegExp(separator));
					source = '';
					for(let i = 0; i < index; i++) {
						source += (params[i] + ' ');
					}
					const location = msg.content.indexOf(source);
					if(location === 0) {
						source = msg.content.substring(source.length);
					}
				}
				break;
			case 2:
				if(msg && msg.mentions && msg.mentions.members) {
					const members = msg.mentions.members.array();
					if(members[index - 1]) {
						source = members[index - 1];
					}
				}
				break;
			case 3:
				if(msg && msg.mentions && msg.mentions.roles) {
					const roles = msg.mentions.roles.array();
					if(roles[index - 1]) {
						source = roles[index - 1];
					}
				}
				break
			case 4:
				if(msg && msg.mentions && msg.mentions.channels) {
					const channels = msg.mentions.channels.array();
					if(channels[index - 1]) {
						source = channels[index - 1];
					}
				}
				break;
			default:
				break;
		}
		if(source) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(source, storage, varName, cache);
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};