module.exports = {

	name: "Unban Member",
	
	section: "Member Control",
	
	subtitle: function(data) {
		return `${data.find}`;
	},
	
	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",
	
	short_description: "Unban Member from banned list",
	
	fields: ["info", "find"],
	
	html: function(isEvent, data) {
		return `
		<div><p>This action has been modified by LeonZ.</p></div><br>
	<div>
		<div style="float: left; width: 40%;">
			Source Field:<br>
			<select id="info" class="round">
				<option value="0" selected>Member ID</option>
				<option value="1">Member Username</option>
			</select>
		</div>
		<div style="float: right; width: 55%;">
			Search Value:<br>
			<input id="find" class="round" type="text">
		</div>
	</div>`
	},
	
	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		if (!server) {
			this.callNextAction(cache);
			return;
		}
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		server.fetchBans().then(bans => {
			let m =false;
			switch(info) {
				case 0:
					m = bans.get(find)
					break;
				case 1:
					for (const member in bans) {
						if (bans[member].user.username == find) {
							m = bans[member];
							break;
						}
					}
					break;
			}
			if (m) {
				server.unban(m);
			}
		})
		this.callNextAction(cache);
	},
	
	mod: function(DBM) {
	}

};
