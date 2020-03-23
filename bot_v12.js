/******************************************************
 * Discord Bot Maker Bot
 * Version 1.5.11
 * Discord.js 12.0.2
 * Robert Borghese
 ******************************************************/

const DBM = {};
DBM.version = "12.0.2";

const DiscordJS = DBM.DiscordJS = require('discord.js');

//---------------------------------------------------------------------
// Bot
// Contains functions for controlling the bot.
//---------------------------------------------------------------------

const Bot = DBM.Bot = {};

Bot.$cmds = {}; // Normal commands
Bot.$icds = []; // Includes word commands
Bot.$regx = []; // Regular Expression commands
Bot.$anym = []; // Any message commands
Bot.$evts = {}; // Events

Bot.bot = null;

Bot.init = function() {
	this.initBot();
	this.reformatData();
	this.initEvents();
	this.login();
};

Bot.initBot = function() {
	this.bot = new DiscordJS.Client();
};

Bot.reformatData = function() {
	this.reformatCommands();
	this.reformatEvents();
};

Bot.reformatCommands = function() {
	const data = Files.data.commands;
	if(!data) return;
	this._caseSensitive = Boolean(Files.data.settings.case === 'true');
	for(let i = 0; i < data.length; i++) {
		const com = data[i];
		if(com) {
			switch(com.comType) {
				case '1':
					this.$icds.push(com);
					break;
				case '2':
					this.$regx.push(com);
					break;
				case '3':
					this.$anym.push(com);
					break;
				default:
					if(this._caseSensitive) {
						this.$cmds[com.name] = com;
						if(com._aliases) {
							const aliases = com._aliases;
							for(let j = 0; j < aliases.length; j++) {
								this.$cmds[aliases[j]] = com;
							}
						}
					} else {
						this.$cmds[com.name.toLowerCase()] = com;
						if(com._aliases) {
							const aliases = com._aliases;
							for(let j = 0; j < aliases.length; j++) {
								this.$cmds[aliases[j].toLowerCase()] = com;
							}
						}
					}
					break;
			}
		}
	}
};

Bot.reformatEvents = function() {
	const data = Files.data.events;
	if(!data) return;
	for(let i = 0; i < data.length; i++) {
		const com = data[i];
		if(com) {
			const type = com['event-type'];
			if(!this.$evts[type]) this.$evts[type] = [];
			this.$evts[type].push(com);
		}
	}
};

Bot.initEvents = function() {
	this.bot.on('ready', this.onReady.bind(this));
	this.bot.on('message', this.onMessage.bind(this));
	Events.registerEvents(this.bot);
};

Bot.login = function() {
	this.bot.login(Files.data.settings.token);
};

Bot.onReady = function() {
	console.log('Bot is ready on Discord.js v12');
	this.restoreVariables();
	this.preformInitialization();
};

Bot.restoreVariables = function() {
	Files.restoreServerVariables();
	Files.restoreGlobalVariables();
};

Bot.preformInitialization = function() {
	const bot = this.bot;
	if(this.$evts["1"]) {
		Events.onInitialization(bot);
	}
	if(this.$evts["3"]) {
		Events.setupIntervals(bot);
	}
};

Bot.onMessage = function(msg) {
	if(!msg.author.bot) {
		try {
			if(!this.checkCommand(msg)) {
				this.onAnyMessage(msg);
			}
		} catch(e) {
			console.error(e);
		}
	}
};

Bot.checkCommand = function(msg) {
	let command = this.checkTag(msg.content);
	if(command) {
		if(!this._caseSensitive) {
			command = command.toLowerCase();
		}
		const cmd = this.$cmds[command];
		if(cmd) {
			Actions.preformActions(msg, cmd);
			return true;
		}
	}
	return false;
};

Bot.checkTag = function(content) {
	const tag = Files.data.settings.tag;
	const separator = Files.data.settings.separator || '\\s+';
	content = content.split(new RegExp(separator))[0];
	if(content.startsWith(tag)) {
		return content.substring(tag.length);
	}
	return null;
};

Bot.onAnyMessage = function(msg) {
	this.checkIncludes(msg);
	this.checkRegExps(msg);
	if(!msg.author.bot) {
		if(this.$evts["2"]) {
			Events.callEvents("2", 1, 0, 2, false, '', msg);
		}
		const anym = this.$anym;
		for(let i = 0; i < anym.length; i++) {
			if(anym[i]) {
				Actions.preformActions(msg, anym[i]);
			}
		}
	}
};

Bot.checkIncludes = function(msg) {
	const text = msg.content;
	if(!text) return;
	const icds = this.$icds;
	const icds_len = icds.length;
	for(let i = 0; i < icds_len; i++) {
		if(icds[i] && icds[i].name) {
			if(text.match(new RegExp('\\b' + icds[i].name + '\\b', 'i'))) {
				Actions.preformActions(msg, icds[i]);
			} else if(icds[i]._aliases) {
				const aliases = icds[i]._aliases;
				const aliases_len = aliases.length;
				for(let j = 0; j < aliases_len; j++) {
					if(text.match(new RegExp('\\b' + aliases[j] + '\\b', 'i'))) {
						Actions.preformActions(msg, icds[i]);
						break;
					}
				}
			}
		}
	}
};

Bot.checkRegExps = function(msg) {
	const text = msg.content;
	if(!text) return;
	const regx = this.$regx;
	const regx_len = regx.length;
	for(let i = 0; i < regx_len; i++) {
		if(regx[i] && regx[i].name) {
			if(text.match(new RegExp(regx[i].name, 'i'))) {
				Actions.preformActions(msg, regx[i]);
			} else if(regx[i]._aliases) {
				const aliases = regx[i]._aliases;
				const aliases_len = aliases.length;
				for(let j = 0; j < aliases_len; j++) {
					if(text.match(new RegExp('\\b' + aliases[j] + '\\b', 'i'))) {
						Actions.preformActions(msg, regx[i]);
						break;
					}
				}
			}
		}
	}
};

//---------------------------------------------------------------------
// Actions
// Contains functions for bot actions.
//---------------------------------------------------------------------

const Actions = DBM.Actions = {};

Actions.actionsLocation = null;
Actions.eventsLocation = null;
Actions.extensionsLocation = null;

Actions.server = {};
Actions.global = {};

Actions.timeStamps = [];

Actions.exists = function(action) {
	if(!action) return false;
	return typeof(this[action]) === 'function';
};

Actions.getLocalFile = function(url) {
	return require('path').join(process.cwd(), url);
};

Actions.getDBM = function() {
	return DBM;
};

Actions.callListFunc = function(list, funcName, args, args2) {
	return new Promise(function(resolve, reject) {
		for(item in list) {
			if(item[funcName] && typeof(item[funcName]) === 'function') {
				if (args2) {
					item[funcName].apply(item, args, args2);
				} else {
					item[funcName].apply(item, args);
				};
			};
		};
		resolve.apply(this, arguments);
		return;
	});
};

Actions.getActionVariable = function(name, defaultValue) {
	if(this[name] === undefined && defaultValue !== undefined) {
		this[name] = defaultValue;
	}
	return this[name];
};

Actions.eval = function(content, cache) {
	if(!content) return false;
	const DBM = this.getDBM();
	const tempVars = this.getActionVariable.bind(cache.temp);
	let serverVars = null;
	if(cache.server) {
		serverVars = this.getActionVariable.bind(this.server[cache.server.id]);
	}
	const globalVars = this.getActionVariable.bind(this.global);
	const msg = cache.msg;
	const server = cache.server;
	const client = DBM.Bot.bot;
	const bot = DBM.Bot.bot;
	const me = server ? server.me : null;
	let user = '', member = '', mentionedUser = '', mentionedChannel = '', defaultChannel = '';
	if(msg) {
		user = msg.author;
		member = msg.member;
		if(msg.mentions) {
			mentionedUser = msg.mentions.users.first() || '';
			mentionedChannel = msg.mentions.channels.first() || '';
		}
	}
	if(server) {
		defaultChannel = server.getDefaultChannel();
	}
	try {
		return eval(content);
	} catch(e) {
		const data = this.getAction(content,cache);
		this.displayError(data,cache,e);
		return false;
	}
};

Actions.evalMessage = function(content, cache) {
	if(!content) return '';
	if(!content.match(/\$\{.*\}/im)) return content;
	return this.eval('`' + content.replace(/`/g,'\\`') + '`', cache);
};

Actions.initMods = function() {
	const fs  = require('fs');
	this.modDirectories().forEach(function(dir) {
		fs.readdirSync(dir).forEach(function(file) {
			if(file.match(/\.js/i)) {
				const action = require(require('path').join(dir, file));
				if(action.action) {
					this[action.name] = action.action;
				}
				if(action.mod) {
					try {
						action.mod(DBM);
					} catch(e) {
						console.error(e);
					}
				}
			}
		}.bind(this));
	}.bind(this));
};

Actions.modDirectories = function() {
	const result = [this.actionsLocation];
	if(Files.verifyDirectory(Actions.eventsLocation)) {
		result.push(this.eventsLocation);
	}
	if(Files.verifyDirectory(Actions.extensionsLocation)) {
		result.push(this.extensionsLocation);
	}
	return result;
}

Actions.preformActions = function(msg, cmd) {
	if(this.checkConditions(msg, cmd) && this.checkTimeRestriction(msg, cmd)) {
		this.invokeActions(msg, cmd.actions);
	}
};

Actions.checkConditions = function(msg, cmd) {
	const isServer = Boolean(msg.guild && msg.member);
	const restriction = parseInt(cmd.restriction);
	const permissions = cmd.permissions;
	switch(restriction) {
		case 0:
			if(isServer) {
				return this.checkPermissions(msg, permissions);
			} else {
				return true;
			}
		case 1:
			return isServer && this.checkPermissions(msg, permissions);
		case 2:
			return isServer && msg.guild.owner === msg.member;
		case 3:
			return !isServer;
		case 4:
			return Files.data.settings.ownerId && msg.author.id === Files.data.settings.ownerId;
		default:
			return true;
	}
};

Actions.checkTimeRestriction = function(msg, cmd) {
	if(!cmd._timeRestriction) return true;
	if(!msg.member) return false;
	const mid = msg.member.id;
	const cid = cmd._id;
	if(!this.timeStamps[cid]) {
		this.timeStamps[cid] = [];
		this.timeStamps[cid][mid] = Date.now();
		return true;
	} else if(!this.timeStamps[cid][mid]) {
		this.timeStamps[cid][mid] = Date.now();
		return true;
	} else {
		const time = Date.now();
		const diff = time - this.timeStamps[cid][mid];
		if(cmd._timeRestriction <= Math.floor(diff / 1000)) {
			this.timeStamps[cid][mid] = time;
			return true;
		} else {
			const remaining = cmd._timeRestriction - Math.floor(diff / 1000);
			Events.callEvents("38", 1, 3, 2, false, '', msg.member, this.generateTimeString(remaining));
		}
	}
};

Actions.generateTimeString = function(miliSeconds) {
	let remaining = miliSeconds;
	const times = [];

	const days = Math.floor(remaining / 60 / 60 / 24);
	if(days > 0) {
		remaining -= (days * 60 * 60 * 24);
		times.push(days + (days === 1 ? " day" : " days"));
	}
	const hours = Math.floor(remaining / 60 / 60);
	if(hours > 0) {
		remaining -= (hours * 60 * 60);
		times.push(hours + (hours === 1 ? " hour" : " hours"));
	}
	const minutes = Math.floor(remaining / 60);
	if(minutes > 0) {
		remaining -= (minutes * 60);
		times.push(minutes + (minutes === 1 ? " minute" : " minutes"));
	}
	const seconds = Math.floor(remaining);
	if(seconds > 0) {
		remaining -= (seconds);
		times.push(seconds + (seconds === 1 ? " second" : " seconds"));
	}

	let result = '';
	if(times.length === 1) {
		result = times[0];
	} else if(times.length === 2) {
		result = times[0] + " and " + times[1];
	} else if(times.length === 3) {
		result = times[0] + ", " + times[1] + ", and " + times[2];
	} else if(times.length === 4) {
		result = times[0] + ", " + times[1] + ", " + times[2] + ", and " + times[3];
	}
	return result;
}

Actions.checkPermissions = function(msg, permissions) {
	const author = msg.member;
	if(!author) return false;
	if(permissions === 'NONE') return true;
	if(msg.guild.owner === author) return true;
	return author.permissions.has([permissions]);
};

Actions.invokeActions = function(msg, actions) {
	const act = actions[0];
	if(!act) return;
	const cache = {
		actions: actions,
		index: 0,
		temp: {},
		server: msg.guild,
		msg: msg
	};
	if(this.exists(act.name)) {
		try {
			this[act.name](cache);
		} catch(e) {
			this.displayError(act, cache, e);
		}
	} else {
		console.error(act.name + " does not exist!");
		this.callNextAction(cache);
	}
};

Actions.invokeEvent = function(event, server, temp) {
	const actions = event.actions;
	const act = actions[0];
	if(!act) return;
	const cache = {
		actions: actions,
		index: 0,
		temp: temp,
		server: server
	};
	if(this.exists(act.name)) {
		try {
			this[act.name](cache);
		} catch(e) {
			this.displayError(act, cache, e);
		}
	} else {
		console.error(act.name + " does not exist!");
		this.callNextAction(cache);
	}
};

Actions.callNextAction = function(cache) {
	cache.index++;
	const index = cache.index;
	const actions = cache.actions;
	const act = actions[index];
	if(!act) {
		if(cache.callback) {
			cache.callback();
		}
		return;
	}
	if(this.exists(act.name)) {
		try {
			this[act.name](cache);
		} catch(e) {
			this.displayError(act, cache, e);
		}
	} else {
		console.error(act.name + " does not exist!");
		this.callNextAction(cache);
	}
};

Actions.getErrorString = function(data, cache, args) {
	const result = this.getName(cache);
	const type = data.permissions ? 'Command' : 'Event';
	if (args) {
		return `Error with ${type} "${result.name}" for Action Name "${data.name}", Action #${cache.index + 1}`;
	} else {
		return `Error with ${type} "${result.name}" for Action Name "${data.name}", Action #${cache.index + 1}`;
	}
};

Actions.displayError = function(data, cache, err, args) {
	const dbm = this.getErrorString(data, cache, args);
	console.error(dbm + ":\n" + err);
	Events.onError(dbm, err.stack ? err.stack : err, cache);
};

Actions.getName = function(cache) {
	const allData = Files.data.commands.concat(Files.data.events);
	let action;
	Object.keys(allData).forEach(function(cmd) {
		if (allData[cmd]) {
			if (JSON.stringify(allData[cmd].actions) == JSON.stringify(cache.actions)) {
				result = allData[cmd];
			}
		}
	})
	return result;
}

Actions.getAction = function(content, cache) {
	const actions = cache.actions;
	let data, permission;
	let index = 0
	content = content.replace(/\n/g, ' ');
	for(const action in actions) {
		index++
		for (let value in actions[action]) {
			if (value == "code" && typeof actions[action][value] != "undefined") {
				value = actions[action][value].replace(/`/g,'\\`').replace(/\n/g, ' ');
				if (value == content) {
					data = actions[action];
					permission = actions.permission;
					break;
				}
			}
		}
	}
	return {name:data.name,index:index,permission:permission};
}

Actions.anchorJump = function(id, cache) {
	const actions = cache.actions;
	const anchorId = id;
	const anchorIndex = actions.findIndex((a) => a.name === "Create Anchor" && a.anchor_id === anchorId);
	if (anchorIndex === -1) {
		console.error('There was not an anchor found with that exact anchor ID!');
		this.callNextAction(cache);
	} else {
		cache.index = anchorIndex - 1;
	};
};

Actions.getSendTarget = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg) {
				return msg.channel;
			}
			break;
		case 1:
			if(msg) {
				return msg.author;
			}
			break;
		case 2:
			if(msg && msg.mentions) {
				return msg.mentions.users.first();
			}
			break;
		case 3:
			if(msg && msg.mentions) {
				return msg.mentions.channels.first();
			}
			break;
		case 4:
			if(server) {
				return server.getDefaultChannel();
			}
			break;
		case 5:
			return cache.temp[varName];
			break;
		case 6:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 7:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.getMember = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg && msg.mentions && msg.mentions.members) {
				return msg.mentions.members.first();
			}
			break;
		case 1:
			if(msg) {
				return msg.member || msg.author;
			}
			break;
		case 2:
			return cache.temp[varName];
			break;
		case 3:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 4:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.getMessage = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg) {
				return msg;
			}
			break;
		case 1:
			return cache.temp[varName];
			break;
		case 2:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 3:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.getServer = function(type, varName, cache) {
	const server = cache.server;
	switch(type) {
		case 0:
			if(server) {
				return server;
			}
			break;
		case 1:
			return cache.temp[varName];
			break;
		case 2:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 3:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.getRole = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg && msg.mentions && msg.mentions.roles) {
				return msg.mentions.roles.first();
			}
			break;
		case 1:
			if(msg && msg.member && msg.member.roles.cache) {
				return msg.member.roles.cache.first();
			}
			break;
		case 2:
			if(server && server.roles.cache) {
				return server.roles.cache.first();
			}
			break;
		case 3:
			return cache.temp[varName];
			break;
		case 4:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 5:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.getChannel = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg) {
				return msg.channel;
			}
			break;
		case 1:
			if(msg && msg.mentions) {
				return msg.mentions.channels.first();
			}
			break;
		case 2:
			if(server) {
				return server.getDefaultChannel();
			}
			break;
		case 3:
			return cache.temp[varName];
			break;
		case 4:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 5:
			return this.global[varName];
			break;
		default: 
			break;
	}
	return false;
};

Actions.getVoiceChannel = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(msg && msg.member) {
				return msg.member.voice.channel;
			}
			break;
		case 1:
			if(msg && msg.mentions) {
				const member = msg.mentions.members.first();
				if(member) {
					return member.voice.channel;
				}
			}
			break;
		case 2:
			if(server) {
				return server.getDefaultVoiceChannel();
			}
			break;
		case 3:
			return cache.temp[varName];
			break;
		case 4:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 5:
			return this.global[varName];
			break;
		default: 
			break;
	}
	return false;
};

Actions.getList = function(type, varName, cache) {
	const msg = cache.msg;
	const server = cache.server;
	switch(type) {
		case 0:
			if(server) {
				return server.members.cache.array();
			}
			break;
		case 1:
			if(server) {
				return server.channels.cache.array();
			}
			break;
		case 2:
			if(server) {
				return server.roles.cache.array();
			}
			break;
		case 3:
			if(server) {
				return server.emojis.cache.array();
			}
			break;
		case 4:
			return Bot.bot.guilds.cache.array();
			break;
		case 5:
			if(msg && msg.mentions && msg.mentions.members) {
				return msg.mentions.members.first().roles.cache.array();
			}
			break;
		case 6:
			if(msg && msg.member) {
				return msg.member.roles.cache.array();
			}
			break;
		case 7:
			return cache.temp[varName];
			break;
		case 8:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 9:
			return this.global[varName];
			break;
		default: 
			break;
	}
	return false;
};

Actions.getVariable = function(type, varName, cache) {
	const server = cache.server;
	switch(type) {
		case 1:
			return cache.temp[varName];
			break;
		case 2:
			if(server && this.server[server.id]) {
				return this.server[server.id][varName];
			}
			break;
		case 3:
			return this.global[varName];
			break;
		default:
			break;
	}
	return false;
};

Actions.storeValue = function(value, type, varName, cache) {
	const server = cache.server;
	switch(type) {
		case 1:
			cache.temp[varName] = value;
			break;
		case 2:
			if(server) {
				if(!this.server[server.id]) this.server[server.id] = {};
				this.server[server.id][varName] = value;
			}
			break;
		case 3:
			this.global[varName] = value;
			break;
		default:
			break;
	}
};

Actions.executeResults = function(result, data, cache) {
	const errors = {'404': 'There was not an anchor found with that exact anchor ID!'};
	if(result) {
		const type = parseInt(data.iftrue);
		switch(type) {
			case 0:
				this.callNextAction(cache);
				break;
			case 2:
				const val = parseInt(this.evalMessage(data.iftrueVal, cache));
				const index = Math.max(val - 1, 0);
				if(cache.actions[index]) {
					cache.index = index - 1;
					this.callNextAction(cache);
				}
				break;
			case 3:
				const amnt = parseInt(this.evalMessage(data.iftrueVal, cache));
				const index2 = cache.index + amnt + 1;
				if(cache.actions[index2]) {
					cache.index = index2 - 1;
					this.callNextAction(cache);
				}
				break;
			case 4:
				const id = this.evalMessage(data.iffalseVal, cache);
				this.anchorJump(id, cache);
				break;
			default:
				break;
		}
	} else {
		const type = parseInt(data.iffalse);
		switch(type) {
			case 0:
				this.callNextAction(cache);
				break;
			case 2:
				const val = parseInt(this.evalMessage(data.iffalseVal, cache));
				const index = Math.max(val - 1, 0);
				if(cache.actions[index]) {
					cache.index = index - 1;
					this.callNextAction(cache);
				}
				break;
			case 3:
				const amnt = parseInt(this.evalMessage(data.iffalseVal, cache));
				const index2 = cache.index + amnt + 1;
				if(cache.actions[index2]) {
					cache.index = index2 - 1;
					this.callNextAction(cache);
				}
				break;
			case 4:
				const id = this.evalMessage(data.iffalseVal, cache);
				this.anchorJump(id, cache);
				break;
			default:
				break;
		}
	}
};

Actions.createEmbed = function(data) {
	if (data) {
		return new DiscordJS.MessageEmbed(data);
	} else {
		return new DiscordJS.MessageEmbed();
	}
};

//---------------------------------------------------------------------
// Events
// Handles the various events that occur.
//---------------------------------------------------------------------

const Events = DBM.Events = {};

let $evts = null;

Events.data = [
	[],[],[],[],['guildCreate', 0, 0, 1],['guildDelete', 0, 0, 1],['guildMemberAdd', 1, 0, 2],['guildMemberRemove', 1, 0, 2],['channelCreate', 1, 0, 2, true, 'arg1.type !== \'text\''],['channelDelete', 1, 0, 2, true, 'arg1.type !== \'text\''],['roleCreate', 1, 0, 2],['roleDelete', 1, 0, 2],['guildBanAdd', 3, 0, 1],['guildBanRemove', 3, 0, 1],['channelCreate', 1, 0, 2, true, 'arg1.type !== \'voice\''],['channelDelete', 1, 0, 2, true, 'arg1.type !== \'voice\''],['emojiCreate', 1, 0, 2],['emojiDelete', 1, 0, 2],['messageDelete', 1, 0, 2, true],['guildUpdate', 1, 3, 3],['guildMemberUpdate', 1, 3, 4],['presenceUpdate', 1, 3, 4],['voiceStateUpdate', 1, 3, 4],['channelUpdate', 1, 3, 4, true],['channelPinsUpdate', 1, 0, 2, true],['roleUpdate', 1, 3, 4],['messageUpdate', 1, 3, 4, true, 'arg2.content.length === 0'],['emojiUpdate', 1, 3, 4],['messageReactionAdd', 1, 0, 2],[],['messageReactionRemoveAll', 1, 0, 2, true],['guildMemberAvailable', 1, 0, 2],['guildMembersChunk', 1, 0, 3],['guildMemberSpeaking', 1, 3, 2],[],[],['guildUnavailable', 1, 0, 1]
];

Events.registerEvents = function(bot) {
	$evts = Bot.$evts;
	for(let i = 0; i < this.data.length; i++) {
		const d = this.data[i];
		if(d.length > 0 && $evts[String(i)]) {
			bot.on(d[0], this.callEvents.bind(this, String(i), d[1], d[2], d[3], !!d[4], d[5]));
		}
	}
	if($evts["29"]) bot.on('messageReactionRemove', this.onReaction.bind(this, "29"));
	if($evts["34"]) bot.on('typingStart', this.onTyping.bind(this, "34"));
	if($evts["35"]) bot.on('typingStop', this.onTyping.bind(this, "35"));
};

Events.callEvents = function(id, temp1, temp2, server, mustServe, condition, arg1, arg2) {
	if(mustServe) {
		if(temp1 > 0 && !arg1.guild) return;
		if(temp2 > 0 && !arg2.guild) return;
	}
	if(condition && eval(condition)) return;
	const events = $evts[id];
	if(!events) return;
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		if(event.temp) temp[event.temp] = this.getObject(temp1, arg1, arg2);
		if(event.temp2) temp[event.temp2] = this.getObject(temp2, arg1, arg2);
		Actions.invokeEvent(event, this.getObject(server, arg1, arg2), temp);
	}
};

Events.getObject = function(id, arg1, arg2) {
	switch(id) {
		case 1: return arg1;
		case 2: return arg1.guild;
		case 3: return arg2;
		case 4: return arg2.guild;
	}
	return undefined;
};

Events.onInitialization = function(bot) {
	const events = $evts["1"];
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		const servers = bot.guilds.cache.array();
		for(let i = 0; i < servers.length; i++) {
			const server = servers[i];
			if(server) {
				Actions.invokeEvent(event, server, temp);
			}
		}
	}
};

Events.setupIntervals = function(bot) {
	const events = $evts["3"];
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		const time = event.temp ? parseFloat(event.temp) : 60;
		bot.setInterval(function() {
			const servers = bot.guilds.cache.array();
			for(let i = 0; i < servers.length; i++) {
				const server = servers[i];
				if(server) {
					Actions.invokeEvent(event, server, temp);
				}
			}
		}.bind(this), time * 1000);
	}
};


Events.onReaction = function(id, reaction, user) {
	const events = $evts[id];
	if(!events) return;
	if(!reaction.message || !reaction.message.guild) return;
	const server = reaction.message.guild;
	const member = server.member(user);
	if(!member) return;
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		if(event.temp) temp[event.temp] = reaction;
		if(event.temp2) temp[event.temp2] = member;
		Actions.invokeEvent(event, server, temp);
	}
};

Events.onTyping = function(id, channel, user) {
	const events = $evts[id];
	if(!events) return;
	if(!channel.guild) return;
	const server = channel.guild;
	const member = server.member(user);
	if(!member) return;
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		if(event.temp) temp[event.temp] = channel;
		if(event.temp2) temp[event.temp2] = member;
		Actions.invokeEvent(event, server, temp);
	}
};

Events.onError = function(text, text2, cache) {
	const events = $evts["37"];
	if(!events) return;
	for(let i = 0; i < events.length; i++) {
		const event = events[i];
		const temp = {};
		if(event.temp) temp[event.temp] = text;
		if(event.temp2) temp[event.temp2] = text2;
		Actions.invokeEvent(event, cache.server, temp);
	}
};

//---------------------------------------------------------------------
// Canvas (require canvas v2.6.0 opentype.js v?)
// Contains functions for image management.
//---------------------------------------------------------------------

const Canvas = require('canvas');
const openType = require('opentype.js');
const fs = require("fs");

const CanvasJS = DBM.CanvasJS = {};

CanvasJS.canvas = Canvas;

CanvasJS.toBuffer = function (path) {
	const image = CanvasJS.loadImage(path);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const buffer = canvas.toBuffer('image/png', {compressionLevel:100});
	return buffer;
}

CanvasJS.toAttachment = function (path, name) {
	const buffer = Canvas.toBuffer(path);
	const attachment = new DiscordJS.MessageAttachment(buffer, name);
	return attachment;
}

CanvasJS.createImage = function (path) {
	const data = Canvas.loadImage(path).then(function(image) {
		const canvas = Canvas.createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image,0,0,image.width,image.height);
		return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	})
	return data;
}

CanvasJS.cropImage = function (path, options) {
	const image = CanvasJS.loadImage(path);
	if (options.width.endsWith("%")) {
		options.width = image.width * parseFloat(options.width) / 100;
	}
	if (options.height.endsWith("%")) {
		options.height = image.height * parseFloat(options.height) / 100;
	}
	if (options.height > image.height) {
		options.height = image.height;
	}
	if (options.width > image.width) {
		options.width = image.width;
	}
	let x, y;
	switch (options.align) {
		case 0:
			x = 0;
			y = 0;
			break;
		case 1:
			x = (options.width / 2) - (image.width / 2);
			y = 0;
			break;
		case 2:
			x = options.width - image.width;
			y = 0;
			break;
		case 3:
			x = 0;
			y = (options.height / 2) - (image.height / 2);
			break;
		case 4:
			x = (options.width / 2) - (image.width / 2);
			y = (options.height / 2) - (image.height / 2);
			break;
		case 5:
			x = options.width - image.width;
			y = (options.height / 2) - (image.height / 2);
			break;
		case 6:
			x = 0;
			y = options.height - image.height;
			break;
		case 7:
			x = (options.width / 2) - (image.width / 2);
			y = options.height - image.height;
			break;
		case 8:
			x = options.width - image.width;
			y = options.height - image.height;
			break;
	}
	const canvas = Canvas.createCanvas(options.width, options.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, x, y, image.width, image.height);
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.drawImage = function (path, path2, options) {
	const image = CanvasJS.loadImage(path);
	const image2 = CanvasJS.loadImage(path2);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	if (options.effect && options.effect == "mask") {
		ctx.globalCompositeOperation = 'destination-out';
	}
	if (!options.x) {
		options.x = 0;
	}
	if (!options.y) {
		options.y = 0;
	}
	ctx.drawImage(image2, options.x, options.y, image2.width, image2.height)
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.drawText = function (path, options) {
	const image = CanvasJS.loadImage(path);
	if (!options.color) {
		options.color = "#000000";
	} else if (!options.color.startsWith("#")) {
		options.color = "#" + options.color;
	}
	if (!options.size) {
		options.size = 10;
	}
	if (!options.x) {
		options.x = 0;
	}
	if (!options.y) {
		options.y = 0;
	}
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const font = openType.loadSync(options.font);
	const textpath = font.getPath(options.text,0,0, options.size);
	const width = textpath.getBoundingBox().x2 - textpath.getBoundingBox().x1;
	const height = textpath.getBoundingBox().y2 - textpath.getBoundingBox().y1;
	switch (options.align) {
		case 1:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
		case 2:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
		case 3:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 4:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 5:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 6:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
			break;
		case 7:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
			break;
		case 8:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
		case 0:
		default:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
	};
	const textholder = font.getPath(options.text, options.x, options.y, options.size);
	textholder.fill = options.color;
	textholder.draw(ctx);
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.editBorder = function (path, options) {
	const image = CanvasJS.loadImage(path);
	let canvas;
	if (options.type == "circle") {
		if (!options.radius && isNaN(options.radius) || options.radius * 2 > image.width && options.radius * 2 > image.height) {
			let max;
			if (image.width > image.height) {
				max = image.height;
			} else {
				max = image.width;
			}
			options.radius = max / 2;
		}
		canvas = Canvas.createCanvas(options.radius * 2,options.radius * 2);
		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(options.radius, options.radius, options.radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		let x = 0;
		let y = 0;
		if (options.radius * 2 < image.width) {
			x -= image.width / 2 - options.radius;
		}
		if (options.radius * 2 < image.height) {
			y -= image.height / 2 - options.radius;
		}
		ctx.drawImage(image, x, y, image.width, image.height);
	} else if (options.type == "round") {
		canvas = Canvas.createCanvas(image.width,image.height);
		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(options.radius,0);
		ctx.lineTo(image.width-options.radius,0);
		ctx.quadraticCurveTo(image.width,0,image.width,options.radius);
		ctx.lineTo(image.width,image.height-options.radius);
		ctx.quadraticCurveTo(image.width,image.height,image.width-options.radius,image.height);
		ctx.lineTo(options.radius,image.height);
		ctx.quadraticCurveTo(0,image.height,0,image.height-options.radius);
		ctx.lineTo(0,options.radius);
		ctx.quadraticCurveTo(0,0,options.radius,0);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(image, 0, 0, image.width, image.height);
	}
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.flipImage = function (path, flip) {
	const image = CanvasJS.loadImage(path);
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,image.width,image.height);
	ctx.save();
	ctx.translate(image.width / 2, image.height / 2);
	switch (parseInt(flip)) {
		case 0:
			ctx.scale(-1,1);
			break;
		case 1:
			ctx.scale(1,-1);
			break;
		case 2:
			ctx.scale(-1,-1);
			break;
	}
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.generateProgress = function (options) {
	let canvas;
	if (options.type == 0) {
		canvas = Canvas.createCanvas(options.width, options.height);
	} else if (options.type == 1) {
		canvas = Canvas.createCanvas(options.size, options.size);
	}
	const ctx = canvas.getContext('2d');
	if (!options.color) {
		ctx.strokeStyle = "#000000";
	} else if (!options.color.startsWith("#")) {
		ctx.strokeStyle = "#" + options.color;
	} else {
		ctx.strokeStyle = options.color;
	}
	ctx.lineWidth = options.lineWidth;
	ctx.lineCap = options.lineCap;
	switch (options.type) {
		case 0:
			ctx.beginPath();
			switch (options.lineCap) {
				case "square":
					ctx.moveTo(0, options.height/2);
					ctx.lineTo(options.width*options.percent/100, options.height/2);
					break;
				case "round":
					let center = options.lineWidth/2;
					let top = options.height/2-center;
					let bottom = options.height/2+center;
					ctx.moveTo(center,top);
					ctx.lineTo(options.width-options.lineWidth,top);
					ctx.arcTo(options.width,top,options.width,options.height/2,center);
					ctx.arcTo(options.width,bottom,top,bottom,center);
					ctx.lineTo(center,bottom);
					ctx.arcTo(0,bottom,0,options.height/2,center);
					ctx.arcTo(0,top,center,top,center);
					ctx.closePath();
					ctx.clip();
					ctx.beginPath();
					ctx.moveTo(-center, options.height/2);
					ctx.lineTo(options.width*options.percent/100-center, options.height/2);
					break;
			}
			break;
		case 1:
			ctx.translate(options.size/2, options.size/2);
			ctx.rotate(-0.5 * Math.PI);
			ctx.beginPath();
			ctx.arc(0, 0, options.radius, 0, Math.PI * 2 * options.percent / 100, false);
			break;
	}
	ctx.stroke();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.loadImage = function (path) {
	const image = new Canvas.Image();
	image.src = path;
	return image;
}

CanvasJS.resizeImage = function (path, options) {
	const image = CanvasJS.loadImage(path);
	if (!options.aspectRatio || typeof options.aspectRatio != "boolean") {
		options.aspectRatio = false;
	}
	if (options.aspectRatio) {
		if (options.width && options.height) {
			if (!isNaN(options.width)) {
				options.scaleWidth = options.width / image.width;
			} else if (options.width.endsWith("%")) {
				options.scaleWidth = parseFloat(options.width) / 100;
			}
			if (!isNaN(options.height)) {
				options.scaleHeight = options.height / image.height;
			} else if (options.height.endsWith("%")) {
				options.scaleHeight = parseFloat(options.height) / 100;
			}
		} else if (options.width) {
			if (!isNaN(options.width)) {
				options.scaleWidth = options.width / image.width;
				options.scaleHeight = options.scaleWidth;
			} else if (options.width.endsWith("%")) {
				options.scaleWidth = parseFloat(options.width) / 100;
				options.scaleHeight = options.scaleWidth;
			}
		} else if (options.height) {
			if (!isNaN(options.height)) {
				options.scaleHeight = options.height / image.height;
				options.scaleWidth = options.scaleHeight;
			} else if (options.height.endsWith("%")) {
				options.scaleHeight = parseFloat(options.height) / 100;
				options.scaleWidth = options.scaleHeight;
			}
		}
	} else {
		if (options.width && !isNaN(options.width)) {
			options.scaleWidth = options.width / image.width;
		} else if (options.width && options.width.endsWith("%")) {
			options.scaleWidth = parseFloat(options.width) / 100;
		}
		if (options.height && !isNaN(options.height)) {
			options.scaleHeight = options.height / image.height;
		} else if (options.height && options.height.endsWith("%")) {
			options.scaleHeight = parseFloat(options.height) / 100;
		}
	}
	if (!options.scaleHeight) {
		options.scaleHeight =1;
	}
	if (!options.scaleWidth) {
		options.scaleWidth =1;
	}
	const canvas = Canvas.createCanvas(image.width*options.scaleWidth,image.height*options.scaleHeight);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0);
	ctx.save();
	ctx.translate(image.width*options.scaleWidth / 2, image.height*options.scaleHeight / 2);
	ctx.scale(options.scaleWidth, options.scaleHeight);
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

CanvasJS.rotateImage = function (path, degree) {
	const radian = Math.PI / 180 * degree;
	const image = CanvasJS.loadImage(path);
	let imageWidth = image.width * Math.abs(Math.cos(radian)) + image.height * Math.abs(Math.sin(radian));
	let imageHeight = image.height * Math.abs(Math.cos(radian)) + image.width * Math.abs(Math.sin(radian));
	const canvas = Canvas.createCanvas(imageWidth, imageHeight);
	const ctx = canvas.getContext('2d');
	ctx.save();
	ctx.translate(imageWidth / 2, imageHeight / 2);
	ctx.rotate(radian);
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	
}

CanvasJS.saveImage = function (path, localPath) {
	const image = CanvasJS.loadImage(path);
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const buffer = canvas.toBuffer();
	fs.writeFileSync(localPath,buffer);
}


//---------------------------------------------------------------------
// Files
// Contains functions for file management.
//---------------------------------------------------------------------

const Files = DBM.Files = {};

Files.data = {};
Files.writers = {};
Files.crypto = require('crypto');
Files.dataFiles = [
	'commands.json',
	'events.json',
	'settings.json',
	'players.json',
	'servers.json',
	'serverVars.json',
	'globalVars.json'
];

Files.startBot = function() {
	const fs = require('fs');
	const path = require('path');
	/*
	if(process.env['IsDiscordBotMakerTest'] === 'true') {
		Actions.location = process.env['ActionsDirectory'];
		this.initBotTest();
	} else if(process.argv.length >= 3 && fs.existsSync(process.argv[2])) {
		Actions.location = process.argv[2];
	} else {
		Actions.location = path.join(__dirname, 'actions');
	}
	*/
	Actions.actionsLocation = path.join(__dirname, 'actions');
	Actions.eventsLocation = path.join(__dirname, 'events');
	Actions.extensionsLocation = path.join(__dirname, 'extensions');
	if(this.verifyDirectory(Actions.actionsLocation)) {
		Actions.initMods();
		this.readData(Bot.init.bind(Bot));
	} else {
		console.error('Please copy the "Actions" folder from the Discord Bot Maker directory to this bot\'s directory: \n' + Actions.actionsLocation);
	}
};

Files.verifyDirectory = function(dir) {
	return typeof dir === 'string' && require('fs').existsSync(dir);
}

Files.readData = function(callback) {
	const fs = require('fs');
	const path = require('path');
	let max = this.dataFiles.length;
	let cur = 0;
	for(let i = 0; i < max; i++) {
		const filePath = path.join(process.cwd(), 'data', this.dataFiles[i]);
		if(!fs.existsSync(filePath)) continue;
		fs.readFile(filePath, function(error, content) {
			const filename = this.dataFiles[i].slice(0, -5);
			let data;
			try {
				if(typeof content !== 'string' && content.toString) content = content.toString();
				data = JSON.parse(this.decrypt(content));
			} catch(e) {
				console.error(`There was issue parsing ${this.dataFiles[i]}!`);
				return;
			}
			this.data[filename] = data;
			if(++cur === max) {
				callback();
			}
		}.bind(this));
	}
};

Files.saveData = function(file, callback) {
	const fs = require('fs');
	const path = require('path');
	const data = this.data[file];
	if(!this.writers[file]) {
		const fstorm = require('fstorm');
		this.writers[file] = fstorm(path.join(process.cwd(), 'data', file + '.json'))
	}
	this.writers[file].write(this.encrypt(JSON.stringify(data)), function() {
		if(callback) {
			callback();
		}
	}.bind(this));
};

Files.initEncryption = function() {
	try {
		this.password = require('discord-bot-maker');
	} catch(e) {
		this.password = '';
	}
};

Files.encrypt = function(text) {
	if(this.password.length === 0) return text;
	const cipher = this.crypto.createCipher('aes-128-ofb', this.password);
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
};

Files.decrypt = function(text) {
	if(this.password.length === 0) return text;
	const decipher = this.crypto.createDecipher('aes-128-ofb', this.password);
	let dec = decipher.update(text, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
};

Files.convertItem = function(item) {
	if(Array.isArray(item)) {
		const result = [];
		const length = item.length;
		for(let i = 0; i < length; i++) {
			result[i] = this.convertItem(item[i]);
		}
		return result;
	} else if(typeof item !== 'object') {
		let result = '';
		try {
			result = JSON.stringify(item);
		} catch(e) {}
		if(result !== '{}') {
			return item;
		}
	} else if(item.convertToString) {
		return item.convertToString();
	}
	return null;
};

Files.saveServerVariable = function(serverID, varName, item) {
	if(!this.data.serverVars[serverID]) {
		this.data.serverVars[serverID] = {};
	}
	const strItem = this.convertItem(item);
	if(strItem !== null) {
		this.data.serverVars[serverID][varName] = strItem;
	}
	this.saveData('serverVars');
};

Files.restoreServerVariables = function() {
	const keys = Object.keys(this.data.serverVars);
	for(let i = 0; i < keys.length; i++) {
		const varNames = Object.keys(this.data.serverVars[keys[i]]);
		for(let j = 0; j < varNames.length; j++) {
			this.restoreVariable(this.data.serverVars[keys[i]][varNames[j]], 2, varNames[j], keys[i]);
		}
	}
};

Files.saveGlobalVariable = function(varName, item) {
	const strItem = this.convertItem(item);
	if(strItem !== null) {
		this.data.globalVars[varName] = strItem;
	}
	this.saveData('globalVars');
};

Files.restoreGlobalVariables = function() {
	const keys = Object.keys(this.data.globalVars);
	for(let i = 0; i < keys.length; i++) {
		this.restoreVariable(this.data.globalVars[keys[i]], 3, keys[i]);
	}
};

Files.restoreVariable = function(value, type, varName, serverId) {
	const bot = Bot.bot;
	let cache = {};
	if(serverId) {
		cache.server = {
			id: serverId
		};
	}
	if(typeof value === 'string' || Array.isArray(value)) {
		this.restoreValue(value, bot).then(function(finalValue) {
			if(finalValue) {
				Actions.storeValue(finalValue, type, varName, cache);
			}
		}.bind(this)).catch(() => {});
	} else {
		Actions.storeValue(value, type, varName, cache);
	}
};

Files.restoreValue = function(value, bot) {
	return new Promise(function(resolve, reject) {
		if(typeof value === 'string') {
			if(value.startsWith('mem-')) {
				return resolve(this.restoreMember(value, bot));
			} else if(value.startsWith('msg-')) {
				return this.restoreMessage(value, bot).then(resolve).catch(reject);
			} else if(value.startsWith('tc-')) {
				return resolve(this.restoreTextChannel(value, bot));
			} else if(value.startsWith('vc-')) {
				return resolve(this.restoreVoiceChannel(value, bot));
			} else if(value.startsWith('r-')) {
				return resolve(this.restoreRole(value, bot));
			} else if(value.startsWith('s-')) {
				return resolve(this.restoreServer(value, bot));
			} else if(value.startsWith('e-')) {
				return resolve(this.restoreEmoji(value, bot));
			} else if(value.startsWith('usr-')) {
				return resolve(this.restoreUser(value, bot));
			}
			resolve(value);
		} else if(Array.isArray(value)) {
			const result = [];
			const length = value.length;
			let curr = 0;
			for(let i = 0; i < length; i++) {
				this.restoreValue(value[i], bot).then(function(item) {
					result[i] = item;
					if(++curr >= length) {
						resolve(result);
					}
				}).catch(function() {
					if(++curr >= length) {
						resolve(result);
					}
				});
			}
		} else {
			resolve(value);
		}
	}.bind(this));
};

Files.restoreMember = function(value, bot) {
	const split = value.split('_');
	const memId = split[0].slice(4);
	const serverId = split[1].slice(2);
	const server = bot.guilds.get(serverId);
	if(server && server.members) {
		const member = server.members.get(memId);
		return member;
	}
};

Files.restoreMessage = function(value, bot) {
	const split = value.split('_');
	const msgId = split[0].slice(4);
	const channelId = split[1].slice(2);
	const channel = bot.channels.get(channelId);
	if(channel && channel.fetchMessage) {
		return channel.fetchMessage(msgId);
	}
};

Files.restoreTextChannel = function(value, bot) {
	const channelId = value.slice(3);
	const channel = bot.channels.get(channelId);
	return channel;
};

Files.restoreVoiceChannel = function(value, bot) {
	const channelId = value.slice(3);
	const channel = bot.channels.get(channelId);
	return channel;
};

Files.restoreRole = function(value, bot) {
	const split = value.split('_');
	const roleId = split[0].slice(2);
	const serverId = split[1].slice(2);
	const server = bot.guilds.get(serverId);
	if(server && server.roles) {
		const role = server.roles.get(roleId);
		return role;
	}
};

Files.restoreServer = function(value, bot) {
	const serverId = value.slice(2);
	const server = bot.guilds.get(serverId);
	return server;
};

Files.restoreEmoji = function(value, bot) {
	const emojiId = value.slice(2);
	const emoji = bot.emojis.get(emojiId);
	return emoji;
};

Files.restoreUser = function(value, bot) {
	const userId = value.slice(4);
	const user = bot.users.get(userId);
	return user;
};

Files.initEncryption();

//---------------------------------------------------------------------
// Audio
// Contains functions for voice channel stuff.
//---------------------------------------------------------------------

const Audio = DBM.Audio = {};

Audio.ytdl = require('ytdl-core');

Audio.queue = {};
Audio.loop = {};
Audio.volumes = {}
Audio.connections = {};
Audio.dispatchers = {};
Audio.caches = {};

Audio.connectToVoice = function(voiceChannel) {
	voiceChannel.join().then(connection => {
		this.loop[voiceChannel.guild.id] == false;
		this.connections[voiceChannel.guild.id] = connection;
		connection.on('disconnect', function() {
			this.connections[voiceChannel.guild.id] = null;
			this.loop[voiceChannel.guild.id] = null;
			this.dispatchers[guild.id] = null;
		})
	}).catch(console.error())
}

Audio.loadInfo = function(item, position, id) {
	const readStream = this.ytdl(item.url, { filter: "audioonly"});

	readStream.on('end',() => {
		item.cache = true;
		this.queue[id][position] = item;
	})

	readStream.on('info', (info,format) => {
		item.title = info.title;
		item.id = info.video_id;
		item.duration = info.length_seconds;
		item.local = ".\\resources\\"+info.video_id+".mp3";
		this.queue[id][position] = item;
		readStream.pipe(fs.createWriteStream(output))
	})
}

Audio.playItem = function(item, id) {
	if (!this.connections[id]) return;
	if (!this.queue[id]) {
		this.queue[id] = [];
		this.queue[id].push(item);
	}
	switch (item.type) {
		case 'file':
		case 'url':
			this.dispatchers[id] = this.connections[id].play(item.url, item.options);
			break;
		case 'yt':
			if (item.cache) {
				this.dispatchers[id] = this.connections[id].play(item.local, item.options);
			} else {
				this.dispatchers[id] = this.connections[id].play(this.ytdl(item.url), item.options);
				this.loadInfo(item, 0, id);
			}
			break;
	}
	this.dispatchers[id].on('speaking',function(talk) {
		if (!talk) {
			if (this.queue[id][0].type == "yt") {
				this.caches[item.id] = Math.floor(new Date().getTime() / 1000) + 1800;
				const bot = this.bot;
				this.startTimeout(item.local,id,bot);
			}
			if(!this.loop[id]) {
				this.queue[id].shift();
			} else if (this.loop[id] == "queue") {
				const item = this.queue[id].shift;
				this.queue[id].push(item);
			}
			if (this.queue[id].length > 0) {
				this.playNext(id);
			}
		}
	})
}

Audio.controlAudio = function(id,action,amount) {
	const seek = this.dispatchers[id].streamOptions.passes * 20;
	const item = this.queue[id][0];
	switch(action) {
		case 3:
			item.options.seek = seek + amount;
			this.playItem(item,id)
			break;
		case 4:
			item.options.seek = seek - amount;
			this.playItem(item,id)
			break;
		case 5:
			this.playItem(item,id);
			break;
	}
}

Audio.playNext = function(id, forceSkip) {
	if(!this.connections[id] || !this.queue[id] || this.queue[id].length < 1 ) return;
	let item;
	if (forceSkip && this.queue[id].length > 1) {
		this.queue[id].shift();
		item = this.queue[id][0];
	} else if (!this.connection[id].voice.speaking) {
		item = this.queue[id][0];
	}
	if (item) {
		this.playItem(item, id);
	}
}

Audio.startTimeout = function(path,id,bot) {
	bot.setTimeout(function(path,id) {
		if (fs.existsSync(path)) {
			if (Math.floor(new Date().getTime() / 1000) > this.caches[id]) {
				fs.unlinkSync(path);
			}
		}
	}.bind(this), 1800000);
}

Audio.shuffleQueue = function(id) {
	if(this.queue[id].length > 1) {
		if (this.connection[id].voice.speaking && this.queue[id].length > 2) {
			const playing = this.queue[id].shift;
			let queue = this.queue[id];
			const queueStr = JSON.stringify(queue);
			while (JSON.stringify(queue) == queueStr) {
				queue.sort(() => Math.random() - 0.5);
			}
			this.queue[id] = queue;
			this.queue[id].unshift(playing);
		} else if (!this.connection[id].voice.speaking) {
			let queue = this.queue[id];
			const queueStr = JSON.stringify(queue);
			while (JSON.stringify(queue) == queueStr) {
				queue.sort(() => Math.random() - 0.5);
			}
			this.queue[id] = queue;
		}
	} 
}

Audio.skipQueue = function(amount, id) {
	if(!this.connections[id]) return;
	if(this.queue[id] && this.queue[id].length > amount) {
		this.queue[id].slice(amount);
		const item = this.queue[id][0];
		this.playItem(item, id);
	}	
}

Audio.addToQueue = function(item, id) {
	if(!this.queue[id]) this.queue[id] = [];
	this.queue[id].push(item);
	if (item.type == "yt") {
		this.loadInfo(item, this.queue[id].length-1, id);
	}
};

Audio.moveQueue = function(from, position, id) {
	if(!this.queue[id]) return;
	const move = this.queue[id][from];
	this.queue[id].splice(from,1);
	this.queue[id].splice(position,0,move);
}	

Audio.removeFromQueue = function (options, id) {
	if(this.connection[id].voice.speaking && options.from != 0) {
		if(this.queue[id] && this.queue[id].length > options.amount + options.from) {
			this.queue[id].splice(options.from, options.amount);
		}
	} else if (this.connection[id].voice.speaking) {
		if(this.queue[id] && this.queue[id].length >= options.amount + options.from) {
			this.queue[id].splice(options.from, options.amount);
		}
	}
}

Audio.removeQueue = function(id) {
	if (this.connection[id].voice.speaking) {
		this.queue[id].splice(1,this.queue[id].length);
	} else {
		this.queue[id] = [];
	}
}

Audio.recordAudio = function(member, options, id) {
	const fs = require('fs');
	if(this.connections[id]) {
		const receiver = this.connections[id].createReceiver();
		const stream = receiver.createStream(member, {end: options.end});
		stream.pipe(fs.createWriteStream(options.fileName));
		return receiver;
		//this.dispatchers[id].destroy();
	}
}

Audio.setVolume = function(options, id) {
	if(this.dispatchers[id]) {
		switch(options.type) {
			case 'db':
				this.dispatchers[id].setVolumeDecibels(options.volume);
				break;
			case 'perceived':
				this.dispatchers[id].setVolumeLogarithmic(options.volume);
				break;
			default:
				this.dispatchers[id].setVolume(options.volume);
				break;
		}
	}
}

//---------------------------------------------------------------------
// GuildMember
//---------------------------------------------------------------------

const GuildMember = DiscordJS.GuildMember;

GuildMember.prototype.data = function(name, defaultValue) {
	const id = this.id;
	const data = Files.data.players;
	if(data[id] === undefined) {
		if(defaultValue === undefined) {
			return null;
		} else {
			data[id] = {};
		}
	}
	if(data[id][name] === undefined && defaultValue !== undefined) {
		data[id][name] = defaultValue;
	}
	return data[id][name];
};

GuildMember.prototype.setData = function(name, value) {
	const id = this.id;
	const data = Files.data.players;
	if(data[id] === undefined) {
		data[id] = {};
	}
	data[id][name] = value;
	Files.saveData('players');
};

GuildMember.prototype.addData = function(name, value) {
	const id = this.id;
	const data = Files.data.players;
	if(data[id] === undefined) {
		data[id] = {};
	}
	if(data[id][name] === undefined) {
		this.setData(name, value);
	} else {
		this.setData(name, this.data(name) + value);
	}
};

GuildMember.prototype.convertToString = function() {
	return `mem-${this.id}_s-${this.guild.id}`;
};

//---------------------------------------------------------------------
// User
//---------------------------------------------------------------------

const User = DiscordJS.User;

User.prototype.data = GuildMember.prototype.data;
User.prototype.setData = GuildMember.prototype.setData;
User.prototype.addData = GuildMember.prototype.addData;

User.prototype.convertToString = function() {
	return `usr-${this.id}`;
};

//---------------------------------------------------------------------
// Guild
//---------------------------------------------------------------------

const Guild = DiscordJS.Guild;

Guild.prototype.getDefaultChannel = function() {
	let channel = this.channels.cache.get(this.id);
	if(!channel) {
		this.channels.cache.array().forEach(function(c) {
			if(c.permissionsFor(DBM.Bot.bot.user).has('SEND_MESSAGES') && c.type !== 'voice' && c.type !== 'category') {
				if(!channel) {
					channel = c;
				} else if(channel.position > c.position) {
					channel = c;
				}
			}
		});
	}
	return channel;
};

Guild.prototype.getDefaultVoiceChannel = function() {
	let channel = this.channels.cache.get(this.id);
	if(!channel) {
		this.channels.cache.array().forEach(function(c) {
			if(c.permissionsFor(DBM.Bot.bot.user).has('CONNECT') && c.type == 'voice') {
				if(!channel) {
					channel = c;
				} else if(channel.position > c.position) {
					channel = c;
				}
			}
		});
	}
	return channel;
};

Guild.prototype.data = function(name, defaultValue) {
	const id = this.id;
	const data = Files.data.servers;
	if(data[id] === undefined) {
		if(defaultValue === undefined) {
			return null;
		} else {
			data[id] = {};
		}
	}
	if(data[id][name] === undefined && defaultValue !== undefined) {
		data[id][name] = defaultValue;
	}
	return data[id][name];
};

Guild.prototype.setData = function(name, value) {
	const id = this.id;
	const data = Files.data.servers;
	if(data[id] === undefined) {
		data[id] = {};
	}
	data[id][name] = value;
	Files.saveData('servers');
};

Guild.prototype.addData = function(name, value) {
	const id = this.id;
	const data = Files.data.servers;
	if(data[id] === undefined) {
		data[id] = {};
	}
	if(data[id][name] === undefined) {
		this.setData(name, value);
	} else {
		this.setData(name, this.data(name) + value);
	}
};

Guild.prototype.convertToString = function() {
	return `s-${this.id}`;
};

//---------------------------------------------------------------------
// Message
//---------------------------------------------------------------------

DiscordJS.Message.prototype.convertToString = function() {
	return `msg-${this.id}_c-${this.channel.id}`;
};

//---------------------------------------------------------------------
// TextChannel
//---------------------------------------------------------------------

DiscordJS.TextChannel.prototype.convertToString = function() {
	return `tc-${this.id}`;
};

//---------------------------------------------------------------------
// VoiceChannel
//---------------------------------------------------------------------

DiscordJS.VoiceChannel.prototype.convertToString = function() {
	return `vc-${this.id}`;
};

//---------------------------------------------------------------------
// Role
//---------------------------------------------------------------------

DiscordJS.Role.prototype.convertToString = function() {
	return `r-${this.id}_s-${this.guild.id}`;
};

//---------------------------------------------------------------------
// Emoji
//---------------------------------------------------------------------

DiscordJS.Emoji.prototype.convertToString = function() {
	return `e-${this.id}`;
};

//---------------------------------------------------------------------
// Start Bot
//---------------------------------------------------------------------

Files.startBot();