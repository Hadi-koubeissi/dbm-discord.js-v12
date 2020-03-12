module.exports = {

	name: "Run Script",

	section: "Other Stuff",

	subtitle: function(data) {
		return `${data.code}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Unknown Type']);
	},

	fields: ["behavior", "interpretation", "code", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 45%;">
			End Behavior:<br>
			<select id="behavior" class="round">
				<option value="0" selected>Call Next Action Automatically</option>
				<option value="1">Do Not Call Next Action</option>
			</select>
		</div>
		<div style="padding-left: 5%; float: left; width: 55%;">
			Interpretation Style:<br>
			<select id="interpretation" class="round">
				<option value="0" selected>Evaluate Text First</option>
				<option value="1">Evaluate Text Directly</option>
			</select>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Custom Code:<br>
		<textarea id="code" rows="9" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		let code;
		if (data.interpretation === "0") {
			code = this.evalMessage(data.code, cache);
		} else {
			code = data.code;
		}
		const result = this.eval(code, cache);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		this.storeValue(result, storage, varName, cache);
		if (data.behavior === "0") {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};