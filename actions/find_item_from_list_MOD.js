module.exports = {

	name: "Find Item Postion From List",

	section: "Lists and Loops",

	subtitle: function(data) {
		const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `Find item position from ${storage[parseInt(data.storage)]} (${data.varName})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName2, 'Unknown Type']);
	},

	fields: ["storage", "varName", "itemName", "storage2", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source List:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round varSearcher" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div id="itemNameHolder" style="float: left; width: 80%;">
			Item Name:<br>
			<input id="itemName" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.refreshVariableList(document.getElementById('storage'));
		glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const list = this.getVariable(storage, varName, cache);
		const name = this.eval(data.itemName, cache);

		let result = null;
    	result = list.indexOf(name);

		if(result) {
			const varName2 = this.evalMessage(data.varName2, cache);
			const storage2 = parseInt(data.storage2);
			this.storeValue(result, storage2, varName2, cache);
		}

		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};