module.exports = {

	name: "Yandex Translate",

	section: "Other Stuff",

	subtitle: function (data) {
		return `Translate to [${data.translateTo}]`;
	},

	author: "EGGSY",

	version: "1.8.6",

	short_description: "Translate words!",

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'Translated String';
		return ([data.varName, dataType]);
	},

	fields: ["apiKey", "translateTo", "translateMessage", "storage", "varName"],

	html: function (isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 60%;">
			Yandex API Key:<br>
			<input id="apiKey" class="round" type="text"><br>
		</div>
		<div style="padding-left: 3px; float: left; width: 35%;">
			Translate to:<br>
			<input id="translateTo" placeholder="Should be 2 letters." class="round" type="text" maxlength="2"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Translate Message:<br>
		<textarea id="translateMessage" rows="9" placeholder="Insert message that you want to translate here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
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

	init: function () {
		const {glob, document} = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function (cache) {
		const {XMLHttpRequest} = require("xmlhttprequest");
		const data = cache.actions[cache.index];
		const apiKey = this.evalMessage(data.apiKey, cache);
		const translateTo = this.evalMessage(data.translateTo, cache);
		const translateMessage = this.evalMessage(data.translateMessage, cache);
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		if (!translateTo || translateTo.length > 2) return console.log("Translate to can only be 2 letters.");
		if (!translateMessage) return console.log("You need to write something to translate.");
		const url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key="+apiKey+"&text="+translateMessage+"&lang="+translateTo
		const result = JSON.parse(Get(url))
		if (result.code === 200) {
			this.storeValue(result.text[0], storage, varName, cache);
		}
		this.callNextAction(cache);
		function Get(yourUrl){
			var Httpreq = new XMLHttpRequest();
			Httpreq.open("GET",yourUrl,false);
			Httpreq.send(null);
			return Httpreq.responseText;      
		}
	},

	mod: function (DBM) {}

};