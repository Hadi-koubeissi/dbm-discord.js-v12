module.exports = {

	name: "Delete Bulk Messages",

	section: "Messaging",

	subtitle: function(data) {
		const channels = ['Same Channel', 'Mentioned Channel', '1st Server Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Delete ${data.count} messages from ${channels[parseInt(data.channel)] || 'Nothing'}`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.2.0",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'Deleted Messages List']);
	},

	fields: ["channel", "varName", "count", "type", "option", "msgid", "filter", "iffalse", "iffalseVal", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div style="width: 550px; height: 350px; overflow-y: scroll;">
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Source Channel:<br>
				<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
					${data.channels[isEvent ? 1 : 0]}
				</select>
			</div>
			<div id="varNameContainer" style="display: none; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text" list="variableList"><br>
			</div>
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 39%;">
				Amount to Delete:<br>
				<input id="count" class="round" type="text">
			</div>
			<div style="padding-left: 3px; float: left; width: 54%;">
				Delete By:<br>
				<select id="type" class="round" onchange="glob.onChange1(this)">
					<option value="0" selected>Exactly Amount</option>
					<option value="1">Filter</option>
				</select><br>
			</div>
		</div><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Delete Message:<br>
				<select id="option" class="round" onchange="glob.onChange2(this)">
					<option value="0" selected>None</option>
					<option value="1">Before The Message ID</option>
					<option value="2">After The Message ID</option>
					<option value="3">Around The Message ID</option>
				</select>
			</div>
			<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
				Message ID:<br>
				<input id="msgid" class="round" type="text">
			</div>
		</div><br><br><br>
		<div id="filterPlaceHolder" style="display: none;">
			<div style="float: left; width: 90%;">
				Filter (JavaScript Strings):<br>
				<input id="filter" class="round" type="text" value="m => m.author.id == 'someID'"><br>
			</div>
		</div>
		<div>
			<div style="float: left; width: 35%;">
				If Delete Bulk Messages Fails:<br>
				<select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
					<option value="0" selected>Continue Actions</option>
					<option value="1">Stop Action Sequence</option>
					<option value="2">Jump To Action</option>
					<option value="3">Skip Next Actions</option>
				</select>
			</div>
			<div id="iffalseContainer" style="padding-left: 5%; display: none; float: left; width: 63%;">
				<span id="iffalseName">Action Number</span>:<br>
				<input id="iffalseVal" class="round" type="text">
			</div>
		</div><br><br><br><br>
		<div style="padding-top: 16px;">
			<div style="float: left; width: 35%;">
				Store Message List To:
				<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
					${data.variables[0]}
				</select>
			</div>
			<div id="varNameContainer3" style="display: none; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName2" class="round" type="text">
			</div>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.onChange1 = function(type) {
			const value = parseInt(type.value);
			const placeholder = document.getElementById("filterPlaceHolder");
			if(value === 0) {
				placeholder.style.display = "none";
			} else {
				placeholder.style.display = null;
			}
		};

		glob.onChange2 = function(option) {
			const value = parseInt(option.value);
			const varNameInput = document.getElementById("varNameContainer2");
			if(value === 0) {
				varNameInput.style.display = "none";
			} else {
				varNameInput.style.display = null;
			}
		};

		glob.channelChange(document.getElementById('channel'), 'varNameContainer');
		glob.onChange1(document.getElementById('type'));
		glob.onChange2(document.getElementById('option'));
		glob.onChangeFalse(document.getElementById('iffalse'));
		glob.variableChange(document.getElementById('storage'), 'varNameContainer3');
	},

	action: async function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		let source;
		const channel = parseInt(data.channel);
		const msg = cache.msg;
		const varName = this.evalMessage(data.varName, cache);
		switch(channel) {
			case 0:
				if(msg) {
					source = msg.channel;
				}
				break;
			case 1:
				if(msg && msg.mentions) {
					source = msg.mentions.channels.cache.first();
				}
				break;
			case 2:
				if(server) {
					source = server.channels.cache.first();
				}
				break;
			case 3:
				source = cache.temp[varName];
				break;
			case 4:
				if(server && this.server[server.id]) {
					source = this.server[server.id][varName];
				}
				break;
			case 5:
				source = this.global[varName];
				break;
		}
		const limit = Math.min(parseInt(this.evalMessage(data.count, cache)), 100);
		const filter = String(this.evalMessage(data.filter, cache));

		try {
			eval(filter)
		} catch (e) {
			this.displayError(e, data, cache);
			return;
		}

		let messages = await msg.channel.messages.fetch({limit:100})
		while (messages.size < limit) {
			let before = messages.last(1)[0].id;
			let fetch = await msg.channel.messages.fetch({limit:100, before: before})
			let result = fetch.filter(filter);
			messages = messages.concat(result)
		}
		while (messages.size > limit) {
			messages = messages.first(limit);
		}
		source.bulkDelete(messages).then(function(result) {
			const storage = parseInt(data.storage);
			if (storage != 0 && result) {
				const varName = this.evalMessage(data.varName2, cache);
				this.storeValue(result.array(), storage, varName, cache);
				this.callNextAction(cache);
			}
		}.bind(this)).catch(function(err) {
			if (err.message == "You can only bulk delete messages that are under 14 days old.") {
				this.executeResults(false, data, cache);
			} else {
				this.displayError.bind(this, data, cache);
			}
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	},

	mod: function(DBM) {
	}

};