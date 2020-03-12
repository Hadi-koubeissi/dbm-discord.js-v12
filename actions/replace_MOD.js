module.exports = {

	name: "Replace",

	section: "Deprecated",

	subtitle: function(data) {
		return `Replaces Text`;
	},

	author: "EliteArtz",

	version: "1.8.7",

	short_description: "Replaces your message what you wan't.",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		let dataType = 'Replaced Text';
		return ([data.varName, dataType]);
	},

	fields: ["replacemsg", "replaceto", "storage", "varName", "ifEach"],

	html: function(isEvent, data) {
		return `
	<div id="modinfo">
		<p>
	   	<u>Mod Info:</u><br>
	   	Made by EliteArtz!<br>
		</p>
		<div padding-top: 8px;">
			Replace Text:<br>
			<textarea id="replacemsg" rows="2" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		</div><br>
		<div style="float: left; width: 50%; padding-top: 8px;">
	   	Replace to:<br>
	   	<input id="replaceto" class="round" type="text">
    	</div><br>
    	<div style="padding-top: 8px;">
        	<select id="ifEach" class="round" style="float: right; width: 45%;">
            	<option value="1">Whole content</option>
            	<option value="0" selected>For Each Word</option>
        	</select>
    	</div><br><br>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store Result In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
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
		var result = {};

		try {
			const replaceTEXT = this.evalMessage(data.replacemsg, cache);
			const replaceTO = this.evalMessage(data.replaceto, cache);
			if (replaceTEXT) {
				if (replaceTO) {
                	if (data.ifEach === "1") {

                    	result = replaceTEXT.replace(replaceTEXT, replaceTO);

                    	const storage = parseInt(data.storage);
                    	const varName = this.evalMessage(data.varName, cache);
                    	this.storeValue(result, storage, varName, cache);

                	} else if (data.ifEach === "0") {

                    	result = replaceTEXT.replace(/(\w+)/g, replaceTO);

						const storage = parseInt(data.storage);
                    	const varName = this.evalMessage(data.varName, cache);
                    	this.storeValue(result, storage, varName, cache);
                	}
				} else {
					console.log('No insert in "Replace To"...');
            	}
			} else {
		    	console.log(`No insert in "Replace Message"...`);
			}
		} catch (e) {
			console.error("ERROR!" + e + e.stack);
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};