module.exports = {

	name: "Store Server Info",

	section: "Server Control",

	subtitle: function (data) {
		const servers = [
			'Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'
		];
		const info = ['Server Object', 'Server ID', 'Server Name', 'Server Name Acronym', 'Server Region', 'Server Icon URL', 'Server Verification Level', 'Server Default Channel', 'Server AFK Channel', 'Server System Channel', 'Server Default Role', 'Server Owner Member', 'Server Bot Member Object', 'Server Channel List', 'Server Role List', 'Server Member List', 'Server Emoji List', 'Server Member Count', 'Creation Date', 'Time To AFK', 'Is Server Available?', 'More than 250 members?', 'Date Bot Joined Server', 'Channel Amount', 'Emoji Amount', 'Embed Links', 'DND Members Count', 'Online Members Count (fixed)', 'Offline Members Count', 'Idle Members Count', 'Total Bots Count In Server', 'Server Channel IDs', 'Server Role IDs', 'Server Member IDs', 'Server Bot Member Count', 'Server Human Member Count', 'Server Member Count', 'Role Count', 'Text Channel Count', 'Voice Channel Count', 'Is Server Verified?', 'Banned Users List', 'Invite List', 'Server Explicit Content Filter'];
		return `${servers[parseInt(data.server)]} - ${info[parseInt(data.info)]}`;
	},

	author: "Lasse, EGGSY, EliteArtz, Danno3817, ACertainCoder, Cap, & CoolGuy",

	version: "1.9.6",

	short_description: "Stores Server Information",

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch (info) {
			case 0: {
				dataType = 'Guild Object';
				break; }
			case 1: {
				dataType = 'Guild ID';
				break; }
			case 2: {}
			case 3: {}
			case 4: {
				dataType = 'Text';
				break; }
			case 5: {
				dataType = 'Image URL';
				break; }
			case 6: {}
			case 43: {}
			case 17: {}
			case 19: {}
			case 23: {}
			case 24: {}
			case 26: {}
			case 27: {}
			case 28: {}
			case 29: {}
			case 30: {}
			case 34: {}
			case 35: {}
			case 36: {}
			case 37: {}
			case 38: {}
			case 39: {
				dataType = 'Number';
				break; }
			case 7: {}
			case 8: {}
			case 9: {
				dataType = 'Channel';
				break; }
			case 10: {
				dataType = 'Role';
				break; }
			case 11: {}
			case 12: {
				dataType = 'Guild Member';
				break; }
			case 13: {
				dataType = 'List';
				break; }
			case 14: {
				dataType = 'List';
				break; }
			case 15: {
				dataType = 'List';
				break; }
			case 16: {
				dataType = 'List';
				break; }
			case 18: {}
			case 22: {
				dataType = "Date";
				break; }
			case 20: {}
			case 21: {}
			case 25: {
				dataType = "Boolean";
				break; }
			case 31: {
				dataType = 'List';
				break; }
			case 32: {
				dataType = 'List';
				break; }
			case 33: {
				dataType = 'List';
				break; }
			case 40: {
				dataType = 'Boolean';
				break; }
			case 41: {}
			case 42: {
				dataType = 'List';
				break; }
		}
		return ([data.varName2, dataType]);
	},

	fields: ["server", "varName", "info", "storage", "varName2"],

	html: function (isEvent, data) {
		return `
		<div><p>This action has been modified by DBM Mods.</p></div><br>
		<div>
			<div style="float: left; width: 35%;">
				Source Server:<br>
				<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
					${data.servers[isEvent ? 1 : 0]}
				</select>
			</div>
			<div id="varNameContainer" style="display: none; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text" list="variableList"><br>
			</div>
		</div><br><br><br>
		<div>
			<div style="padding-top: 8px; width: 70%;">
				Source Info:<br>
				<select id="info" class="round">
					<optgroup label="Standard DBM">
						<option value="0" selected>Server Object</option>
						<option value="1">Server ID</option>
						<option value="2">Server Name</option>
						<option value="3">Server Name Acronym</option>
						<option value="4">Server Region</option>
						<option value="5">Server Icon URL</option>
						<option value="6">Server Verification Level</option>
						<option value="43">Server Explicit Content Filter</option>
						<!--<option value="7">Server Default Channel</option>-->
						<option value="8">Server AFK Channel</option>
						<option value="9">Server System Channel</option>
						<option value="10">Server Default Role</option>
						<option value="11">Server Owner Member</option>
						<option value="12">Server Bot Member Object</option>
						<option value="13">Server Channel List</option>
						<option value="14">Server Role List</option>
						<option value="15">Server Member List</option>
						<option value="16">Server Emoji List</option>
					</optgroup>
					<optgroup label="Creation/Join Dates">
						<option value="18" selected>Servers Creation Date</option>
						<option value="22">Date Bot Joined</option>
					</optgroup>
					<optgroup label="Member Infos">
						<!--<option value="17">Server Member Count</option>-->
						<option value="30">Total Bots in Servers</option>
						<option value="34">Bot Count (Same as Total Bots In Servers)</option>
						<option value="35">Human Member Count</option>
						<option value="36">Member Count</option>
						<option value="41">Banned Member List</option>
					</optgroup>
					<optgroup label="Member Status Infos">
						<option value="27">Online Members Count</option>
						<option value="29">Idle Members Count</option>
						<option value="26">DND Members Count</option>
						<option value="28">Offline Members Count</option>
					</optgroup>
					<optgroup label="ID Infos">
						<option value="31">Server Channel IDs</option>
						<option value="32">Server Role IDs</option>
						<option value="33">Server Member IDs</option>
					</optgroup>
					<optgroup label="Channel Infos">
						<option value="23">Channel Amount</option>
						<option value="38">Text Channel Count</option>
						<option value="39">Voice Channel Count</option>
					</optgroup>			
					<optgroup label="Other">
						<option value="40">Is Server Verified?</option>
						<option value="19">Time User gets AFK</option>
						<option value="20">Is Server available?</option>
						<option value="24">Emoji Amount</option>
						<option value="25">Embeds links?</option>
						<option value="37">Role Count</option>
						<option value="42">Invite List</option>
					</optgroup>				
					<!--<option value="21">More Than 250 Members?</option>-->				
				</select>
			</div>
		</div><br>
		<div>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer2" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName2" class="round" type="text"><br>
			</div>
		</div>`
	},

	init: function () {
		const { glob, document } = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer')
	},

	action: async function (cache) {
		const data = cache.actions[cache.index];
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const targetServer = this.getServer(server, varName, cache);
		if (!targetServer) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch (info) {
			case 0: {
				result = targetServer;
				break; }
			case 1: {
				result = targetServer.id;
				break; }
			case 2: {
				result = targetServer.name;
				break; }
			case 3: {
				result = targetServer.nameAcronym;
				break; }
			case 4: {
				result = targetServer.region;
				break; }
			case 5: {
				result = targetServer.iconURL();
				break; }
			case 6: {
				result = targetServer.verificationLevel;
				break; }
			case 7: {
				result = targetServer.defaultChannel; //???
				break; }
			case 8: {
				result = targetServer.afkChannel;
				break; }
			case 9: {
				result = targetServer.systemChannel;
				break; }
			case 10: {
				result = targetServer.defaultRole; //???
				break; }
			case 11: {
				result = targetServer.owner;
				break; }
			case 12: {
				result = targetServer.me;
				break; }
			case 13: {
				result = targetServer.channels.cache.array();
				break; }
			case 14: {
				result = targetServer.roles.cache.array();
				break; }
			case 15: {
				result = targetServer.members.cache.array();
				break; }
			case 16: {
				result = targetServer.emojis.cache.array();
				break; }
			case 17: {
				result = targetServer.members.cache.size;
				break; }
			case 18: {
				result = targetServer.createdAt;
				break; }
			case 19: {
				result = targetServer.afkTimeout;
				break; }
			case 20: {
				result = targetServer.available;
				break; }
			case 21: {
				result = targetServer.large;
				break; }
			case 22: {
				result = targetServer.joinedAt;
				break; }
			case 23: {
				result = targetServer.channels.cache.array().length;
				break; }
			case 24: {
				result = targetServer.emojis.cache.array().length;
				break; }
			case 25: {
				result = targetServer.embedEnabled;
				break; }
			case 26: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.presence.status == "dnd").size;
				break; }
			case 27: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.presence.status == "online").size;
				break; }
			case 28: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.presence.status == "offline").size;
				break; }
			case 29: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.presence.status == "idle").size;
				break; }
			case 30: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.bot).size;
				break; }
			case 31: {
				result = targetServer.channels.cache.map(channels => channels.id);
				break; }
			case 32: {
				result = targetServer.roles.cache.map(roles => roles.id);
				break; }
			case 33: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.map(members => members.id);
				break; }
			case 34: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.filter(m => m.user.bot == true).size;
				break; }
			case 35: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.members.cache.filter(m => m.user.bot == false).size;
				break; }
			case 36: {
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.fetchMembers();
				}
				result = targetServer.memberCount;
				break; }
			case 37: {
				result = targetServer.roles.size;
				break; }
			case 38: {
				result = targetServer.channels.cache.filter(c => c.type == "text").size;
				break; }
			case 39: {
				result = targetServer.channels.cache.filter(c => c.type == "voice").size;
				break; }
			case 40: {
				result = targetServer.verified;
				break; }
			case 41: {
				const bans = await targetServer.fetchBans();
				result = bans.array();
				break; }
			case 42: {
				const invites = await targetServer.fetchInvites();
				result = invites.array();
				break; }
			case 43: {
				result = targetServer.explicitContentFilter;
				break; }
			default: {
				break; }
		};
		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		};
		this.callNextAction(cache);
	},

	mod: function (DBM) {
	}
};