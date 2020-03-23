module.exports = {

	name: "Store Member Data List",

	section: "Member Control",

	author: "Two",

	version: "1.9.4",

	short_description: "This mod allows you to grab the members from a dataname then sort/dont sort it and/or use a result limit.",
	long_description: "While using this mod you can grab the members tag from a dataname that are stored in 'players.json'. You can use these members to sort their datas/dont sort and/or use a result limit. This mod can be used to make a leaderboard without MySQL or any other SQL Database.",

	subtitle: function (data) {
		return `${[(data.dataName)]}`
	},

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName2, 'Array']);
	},

	fields: ["numbefst2", "numbefst", "numbefstselect", "sort", "start", "middle", "end", "getresults", "dataName", "varName2", "storage"],

	html: function (isEvent, data) {
		return `
	<html>
		<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll;">
			<div>
				<div style="padding-top: 8px;">
					<div style="float: left; width: 50%;">
						Data Name:<br>
						<input id="dataName" class="round" type="text">
					</div>
					<span>
				</div>
      				Number before start
					<select id="numbefstselect" class="round" style="width:33%" onchange="glob.onChange1(this)">
						<option value="1" >No</option>
						<option value="2"selected>Yes</option>
					</select> <br>
				<div id="numbefst" style=" width: 80%; display: none;">
					Char after Number:<br>
					<input id="numbefst2" class="round" type="text" value=")">
				</div><br>
				Start:
				<select id="start" class="round" style="width:33%">
					<option value="result" >Result</option>
					<option value="username"selected>Username</option>
				</select><br>
    			<div style="display: table-cell;">
					Middle:
					<input id="middle" style="width:80%"  class="round" type="text" value="-"><br>
					End:
					<select id="end" class="round" style="width:100%">
						<option value="result" selected>Result</option>
						<option value="username">Username</option>
					</select><br>
   					</span>
   				</div>
   				<select id="sort" class="round" style="width: 90%;">
   					<option value="0" selected>Don't Sort</option>
   					<option value="1" selected>Sort from Descending</option>
   					<option value="2">Sort from Ascending</option>
				</select><br>
				<div style="float: left; width: 50%; font-family: monospace; white-space: nowrap; resize: none;">
					Result Limit:
					<input id="getresults" class="round" type="text" placeholder="If blank it gets all results.">
				</div><br><br><br>
				<div style="float: left; width: 35%; font-family: monospace; white-space: nowrap; resize: none;"">
					Store In:<br>
					<select id="storage" class="round">
						${data.variables[1]}
					</select>
				</div>
				<div id="varNameContainer2" style="float: right; width: 60%;">
					Variable Name:<br>
					<input id="varName2" class="round" type="text"><br>
				</div>
			</div>
		</div>
	</html>`
	},

	init: function () {
		const {
			glob,
			document
		} = this;
		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById('numbefst');

			if(value == 1) {
				dom.style.display = 'none';
			} else if(value == 2) {
				dom.style.display = null;
			}
		}

		glob.onChange1(document.getElementById('numbefstselect'));
	},

	action: function (cache) {
		const data = cache.actions[cache.index];
		const msg = cache.msg;
		const storage = parseInt(data.storage);
		const varName2 = this.evalMessage(data.varName2, cache);
		const st = this.evalMessage(data.start, cache)
		const mid = this.evalMessage(data.middle, cache)
		const selectionsnum = parseInt(data.numbefstselect);
		const dataName = this.evalMessage(data.dataName, cache);

		const en = this.evalMessage(data.end, cache)
		const sort = parseInt(data.sort);
		const WrexMODS = this.getWrexMods();

		const fastsort = WrexMODS.require('fast-sort');
		const {JSONPath} = WrexMODS.require('jsonpath-plus');
		const fs = require('fs')
		var file = fs.readFileSync("./data/players.json", 'utf8');

		if (file && val !== undefined) {
			dataName = '[' + "'" + dataName + "'" + ']';
			var list2 = [];
			var list = [];
			var list4 = [];
			var list5 = [];
			var file = JSON.parse(file)
			try {
				var list = [];
				var result = JSONPath({path: '$.[?(@' + dataName + ' || @' + dataName + ' > -9999999999999999999999999999999999999999999999999999999)]*~', json: file});
				let tag2, res2, user;
				for (let i = 0; i < result.length; i++) {
					let result2 = JSONPath({path: '$.' + result[i] + dataName, json: file});
					try {
						user = msg.guild.members.cache.get(result[i]);
						tag = user.user.tag
						tag2 = "" + tag + "";
						res2 = "" + result2 + "";
						list.push({id: tag2, name2: res2});
					} catch (err) {
						this.displayError(data, cache, err)
					}
				}
				switch (sort) {
					case 1:
						result = fastsort(list).desc(u => parseInt(u.name2));
						break;
					case 2:
						result = fastsort(list).asc(u => parseInt(u.name2));
						break;
					case 0:
						result = list
						break;
				}
				let getres = parseInt(this.evalMessage(data.getresults, cache));
				if (!getres) {
					getres = result.length;
				}
				for (let i = 0; i < getres; i++) {
					var result2 = JSON.stringify(list[i])
					try {
						var file = JSON.parse(result2)
						var res = JSONPath({path: '$..name2', json: file});
						res2 = JSONPath({path: '$..id', json: file});
						var username = res2
						var result = res
						eval(' ' + st + ' ');
						var middle = " " + mid + " "
						eval(' ' + en + ' ');
						var username = res2
						var result = res
						var en2 = eval(en);
						var st2 = eval(st);
						list5.push("easter egg :eyes:")
						switch (selectionsnum) {
							case 1:
								list2.push(st2 + middle + en2 + '\n')
								break;
							case 2:
								var num = list5.length;
								var numbef = this.evalMessage(data.numbefst2, cache)
								list2.push(num + numbef + " " + st2 + middle + en2 + '\n')
								break;
						}
					} catch (err) {
						this.displayError(data, cache, err);
					}
					list4 = list2.join('')
				}
				_this.storeValue(list4, storage, varName2, cache)
				_this.callNextAction(cache);
			} catch (err) {
				this.displayError(data, cache, err);
			}
		}
	},

	mod: function (DBM) {
	}

};