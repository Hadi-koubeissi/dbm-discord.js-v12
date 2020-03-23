module.exports = {

name: "Member Vote on top.gg MOD",

isEvent: true,

fields: ["Your top.gg token", "Temp Variable Name (stores member that just voted):"],

mod: function(DBM) {
	DBM.DBL = DBM.DBL || {};

	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.DBL.start();
		onReady.apply(this, ...params);
	}

	DBM.DBL.start = function() {
		const events = DBM.Bot.$evts["Member Vote on top.gg MOD"];
		if (!events) return;
		const DBL = require("dblapi.js");
		for (const event of events) {
			const json = JSON.parse(event.temp);
			const token = json.token;
			const password = json.password;
			
			
			const express = require('express');
			const http = require('http');
			const app = express();
			const servers = http.createServer(app);
			
			const dbl = new DBL(token, {webhookPort: 5000, webhookAuth: password, webhookServer: servers, webhookPath:'/webhook'});
			dbl.on('error', e => {
				console.log(`Oops! ${e}`);
			})
			app.get('/', (req, res) => {
			});

			servers.listen(5000)
			dbl.getUser("521189580448464896").then(stat => {
				console.log(stat)
			})
			dbl.webhook.on('vote', vote => {
				console.log("vote")
				console.log(vote)
				console.log("user")
				console.log(vote.user)
				
				if(event.temp2) temp[event.temp2] = vote.user;
				Actions.invokeEvent(event, server, temp);
			});
			dbl.webhook.on('ready', hook => {
				console.log(hook)
				console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
			})
		}
		
	}
}
}