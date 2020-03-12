module.exports = {

	name: "Store Bot Client Info",

	section: "Bot Client Control",

	subtitle: function (data) {
		const info = ['Uptime in Milliseconds', 'Ready At?', 'Ping', 'Guild Amount', 'User Amount', 'Rounded Ping', 'Uptime in Seconds', 'Uptime in Minutes', 'Bot\'s Token', 'Voice Connections Amount', 'Total Amount of Channels', 'Total Amount of Emojis', 'Bot\'s Previous Pings', 'Uptime in Days', 'Uptime in Days (Rounded)', 'Memory (RAM) Usage', 'Bot Guilds Objects', 'Bot Guilds Names', 'Bot Guilds IDs', 'Bot Current Prefix', 'Bot Client ID', 'Discord JS Version', 'Uptime in Hours', 'Refreshing Uptime in Days', 'Refreshing Uptime in Hours', 'Refreshing Uptime in Minutes', 'Refreshing Uptime in Seconds', 'Memory (RAM) Usage in MB', 'Bot\'s OS (Process Platform)', 'CPU Usage in MB', 'Bot\'s Directory', 'Node JS Version', 'Amount of Commands', 'Amount of Events', 'Ready At ? [timestamp]', 'CPU Core Count', 'Total Memory (GB)', 'Total Memory (MB)', 'Available Memory (GB)', 'Available Memory (MB)', 'Available Memory (%)', 'Used Memory (GB)', 'Used Memory (MB)', 'Used Memory (%)', 'Bot Owner ID'];
		return `Bot Client - ${info[parseInt(data.info)]}`;
	},

	author: "Lasse, EliteArtz, EGGSY, Danno3817 & MrGold",

	version: "1.9",

	short_description: "Stores Bot Information like Ping, Total Members or Guilds...",

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Type';
		switch (info) {
			case 0:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 9:
			case 10:
			case 11:
			case 12:
			case 15:
			case 22:
			case 27:
			case 29:
			case 32:
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
			case 38:
			case 39:
			case 40:
			case 41:
			case 42:
			case 43:
				dataType = "Number";
				break;
			case 1:
				dataType = "Date";
				break;
			case 8:
				dataType = "Token";
				break;
			case 13:
			case 14:
			case 23:
			case 24:
			case 25:
			case 26:
				dataType = "Time";
				break;
			case 16:
				dataType = "Guild";
				break;
			case 17:
				dataType = "Guild Name";
				break;
			case 18:
				dataType = "Guild ID";
				break;
			case 19:
				dataType = "Bot Tag";
				break;
			case 20:
				dataType = "Bot ID";
				break;
			case 21:
				dataType = "Version Number";
				break;
			case 28:
				dataType = "OS Name";
				break;
			case 30:
				dataType = "Directory";
				break;
			case 31:
				dataType = "Version Number";
				break;
			case 44:
				dataType = "Bot Owner ID";
				break;

		}
		return ([data.varName2, dataType]);
	},

	fields: ["info", "storage", "varName2"],

	html: function (isEvent, data) {
		return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EliteArtz, EGGSY, Lasse, Danno3817 & MrGold!
		</p>
	</div><br>
	<div style="float: left; width: 80%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<optgroup label="Uptimes">
				<option value="23">Refreshing Uptime in Days</option>
				<option value="24">Refreshing Uptime in Hours</option>
				<option value="25">Refreshing Uptime in Minutes</option>
				<option value="26">Refreshing Uptime in Seconds</option>
			</optgroup>
			<optgroup label="Values">
				<option value="3">Total Amount of Guilds</option>
				<option value="4">Total Amount of Users</option>
				<option value="10">Total Amount of Channels</option>
				<option value="11">Total Amount of Emojis</option>
        		<option value="32">Total Amount of Commands</option>
        		<option value="33">Total Amount of Events</option>
				<option value="9">Total Voice Connections</option>
      		</optgroup>
      		<optgroup label="Guilds Arrays">
				<option value="16">Bot Guilds Objects</option>
				<option value="17">Bot Guilds Names</option>
				<option value="18">Bot Guilds IDs</option>
			<optgroup label="Bot Informations">
				<option value="19">Bot Current Prefix</option>
				<option value="20">Bot Client ID</option>
				<option value="44">Bot Owner ID</option>
				<option value="28">Bot OS (Process Platform)</option>
				<option value="30">Bot Directory</option>
				<option value="8">Bot Token (be careful)</option>
			</optgroup>
			<optgroup label="System Measurements">
				<option value="29">CPU Usage (MB)</option>			
				<option value="35">CPU Core Count</option>			
				<option value="36">Total Memory (GB)</option>
				<option value="37">Total Memory (MB)</option>
				<option value="38">Available Memory (GB)</option>
				<option value="39">Available Memory (MB)</option>
				<option value="40">Available Memory (%)</option>				
				<option value="41">Used Memory (GB)</option>
				<option value="42">Used Memory (MB)</option>
				<option value="43">Used Memory (%)</option>
			</optgroup>
			<optgroup label="Bot Measurments">
				<option value="27">Memory (RAM) Usage in MB</option>
				<option value="1">Ready at</option>
				<option value="34">Ready at [unix timestamp]</option>
				<option value="2">Ping</option>
				<option value="5">Ping Rounded</option>
				<option value="12">Bots Previous Pings</option>
			</optgroup>
			<optgroup label="Versions">
				<option value="21">Discord JS Version</option>
				<option value="31">Node JS Version</option>
			</optgroup>
		</select>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function () { },

	action: function (cache) {
		const os = require('os');
		const client = this.getDBM().Bot.bot;
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const msToDay = (1000 * 60 * 60 * 24);
		switch (info) {
			case 0:
				result = client.uptime;
				break;
			case 1:
				result = client.readyAt;
				break;
			case 2:
				result = client.ws.ping;
				break;
			case 3:
				result = client.guilds.cache.array().length;
				break;
			case 4:
				result = client.users.cache.array().length;
				break;
			case 6:
				result = Math.floor(client.uptime / 1000);
				break;
			case 7:
				result = Math.floor(client.uptime / 1000 / 60);
				break;
			case 8:
				result = client.token;
				break;
			case 9:
				result = client.voice.connections.size;
				break;
			case 10:
				result = client.channels.cache.size;
				break;
			case 11:
				result = client.emojis.cache.size;
				break;
			case 13:
				result = client.uptime / msToDay;
				break;
			case 14:
				result = Math.floor(client.uptime / msToDay);
				break;
			case 15:
				result = ((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2) + "%";
				break;
			case 16:
				result = client.guilds.cache;
				break;
			case 17:
				result = client.guilds.cache.array();
				break;
			case 18:
				result = client.guilds.cache.map(guilds => guilds.id);
				break;
			case 19:
				result = this.getDBM().Files.data.settings.tag;
				break;
			case 20:
				result = this.getDBM().Files.data.settings.client;
				break;
			case 44:
				result = this.getDBM().Files.data.settings.ownerId;
				break;
			case 21:
				result = this.getDBM().DiscordJS.version;
				break;
			case 22:
				result = Math.floor(client.uptime / 1000 / 60 / 60);
				break;
			case 23:
				result = Math.floor((process.uptime() % 31536000) / 86400);
				break;
			case 24:
				result = Math.floor((process.uptime() % 86400) / 3600);
				break;
			case 25:
				result = Math.floor((process.uptime() % 3600) / 60);
				break;
			case 26:
				result = Math.round(process.uptime() % 60);
				break;
			case 27:
				result = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
				break;
			case 28:
				if (process.platform) {
					const platform = process.platform;
					if (platform === 'win32') result = 'Windows';
					else if (platform === 'aix') result = 'Aix';
					else if (platform === 'linux') result = 'Linux';
					else if (platform === 'darwin') result = 'Darwin';
					else if (platform === 'openbsd') result = 'OpenBSD';
					else if (platform === 'sunos') result = 'Solaris';
					else if (platform === 'freebsd') result = 'FreeBSD';
				}
				break;
			case 29:
				result = (process.cpuUsage().user / 1024 / 1024).toFixed(2);
				break;
			case 30:
				result = process.cwd();
				break;
			case 31:
				result = process.versions.node;
				break;
			case 32:
				result = this.getDBM().Files.data.commands.length;
				break;
			case 33:
				result = this.getDBM().Files.data.events.length;
				break;
			case 34:
				result = client.readyTimestamp;
				break;
			case 35:
				result = os.cpus().length;
				break;
			case 36:
				result = (((os.totalmem() / 1024) / 1024) / 1024).toFixed(2);
				break;
			case 37:
				result = ((os.totalmem() / 1024) / 1024).toFixed(0);
				break;
			case 38:
				result = (((os.freemem() / 1024) / 1024) /1024).toFixed(2);
				break;
			case 39:
				result = ((os.freemem() / 1024) / 1024).toFixed(0);
				break;
			case 40:
				result = Math.floor((os.freemem() / os.totalmem()) * 100);
				break;
			case 41:
				var usedMem = os.totalmem() - os.freemem();
				result = (((usedMem / 1024) / 1024) / 1024).toFixed(2);
				break;
			case 42:
				var usedMem = os.totalmem() - os.freemem();
				result = ((usedMem / 1024) / 1024).toFixed(0);
				break;
			case 43:
				var usedMem = os.totalmem() - os.freemem();
				result = Math.floor((usedMem / os.totalmem()) * 100);
				break;
			default:
				break;
		}
		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		}
		this.callNextAction(cache);
	},

	mod: function (DBM) { }

};