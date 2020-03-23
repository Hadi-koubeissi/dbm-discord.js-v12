module.exports = {

	name: "Reload",

	section: "Other Stuff",

	subtitle: function(data) {
		return 'Commands and Events';
	},

	fields: [],

	html: function(isEvent, data) {
		return ``
	},

	init: function() {
	},

	action: function(cache) {
		//Thanks to Wrex for this reload
		const fs = require('fs');
		const path = require('path');
		const Files = this.getDBM().Files;
		const Events = this.getDBM().Events;
		const Bot = this.getDBM().Bot;
		const Client = Bot.bot;
		Files.data.commands = {};
		Files.data.events = {};
		Bot.$cmds = {};
		Bot.$icds = [];
		Bot.$regx = [];
		Bot.$anym = [];
		Bot.$evts = {};
		Files.readDataFile = function(filename, callback) {
			const filePath = path.join(process.cwd(), 'data', filename + ".json");
			if(fs.existsSync(filePath)){
  				fs.readFile(filePath, function(error, content) {
    				let data;
    				try {
    				if(typeof content !== 'string' && content.toString) content = content.toString();
        				data = JSON.parse(Files.decrypt(content));
    				} catch(e) {
        				console.error(`There was issue parsing ${filePath}!` + e);
        				return;
    				}
    				Files.data[filename] = data;
    				callback();
  				});
			} else {
				console.error(filename + ".json not exist!");
			}
		};
		Files.readDataFile("commands", ()=>{
			Files.readDataFile("events", ()=>{
				Bot.reformatData();
				Events.registerEvents(Client);
				this.callNextAction(cache);
			});
		});
	},

	mod: function(DBM) {
	}

};