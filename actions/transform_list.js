module.exports = {

	name: "Transform List",

	section: "Lists and Loops",

	subtitle: function(data) {
		const list = ['Server Members', 'Server Channels', 'Server Roles', 'Server Emojis', 'All Bot Servers', 'Mentioned User Roles', 'Command Author Roles', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Transform ${list[parseInt(data.list)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, 'List']);
	},

	fields: ["list", "varName", "transform", "null", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source List:<br>
			<select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
				${data.lists[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br><br>
	<div style="display: table; width: 100%;">
		<div style="display: table-cell;">
			Transform Eval:
			<input id="transform" class="round" type="text" name="is-eval" value="item">
		</div>
		<div style="display: table-cell;">
			Null Value:
			<input id="null" class="round" type="text" name="is-eval">
		</div>
	</div><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.listChange(document.getElementById('list'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.list);
		const varName = this.evalMessage(data.varName, cache);
		const list = this.getList(storage, varName, cache);

		let result = [];
		const code = this.evalMessage(data.transform, cache);
		const nullVal = this.evalMessage(data.null, cache);
		let defaultVal;

		try {
			defaultVal = eval(nullVal);
		} catch(e) {
			this.displayError(data, cache, e);
			defaultVal = '';
		}

		for(let i = 0; i < list.length; i++) {
			const item = list[i];
			try {
				const val = eval(code);
				if(val) {
					result.push(val);
				} else if(defaultVal) {
					result.push(defaultVal);
				}
			} catch(e) {
				this.displayError(data, cache, e);
				if(defaultVal) {
					result.push(defaultVal);
				}
			}
		}

		if(result) {
			const varName2 = this.evalMessage(data.varName2, cache);
			const storage2 = parseInt(data.storage);
			this.storeValue(result, storage2, varName2, cache);
		}

		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};