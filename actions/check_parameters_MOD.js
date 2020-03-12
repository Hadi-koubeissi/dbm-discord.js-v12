module.exports = {

commandOnly: true,

name: "Check Parameters",

section: "Conditions",

subtitle: function(data) {
	const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
	return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
},

github: "LeonZ2019/DBM",
author: "LeonZ",
version: "1.1.0",

fields: ["condition", "comparison", "value", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

html: function(isEvent, data) {
	return `
	<div><p>This action has been modified by LeonZ.</p></div><br>
<div>
	<div style="float: left; width: 45%;">
		Condition:<br>
		<select id="condition" class="round">
			<option value="0" selected>Number of Parameters is...</option>
			<option value="1">Number of Member Mentions are...</option>
			<option value="2">Number of Channel Mentions are...</option>
			<option value="3">Number of Role Mentions are...</option>
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 25%;">
		Comparison:<br>
		<select id="comparison" class="round">
			<option value="0" selected>Equal =</option>
			<option value="1">Less Than \<</option>
			<option value="2">Great Than \></option>
			<option value="3">Less Than or Equal \<=</option>
			<option value="4">Great Than or Equal \>=</option>
		</select>
	</div>
	<div style="padding-left: 5%; float: left; width: 25%;">
		Number:<br>
		<input id="value" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`
},

init: function() {
	const {glob, document} = this;

	glob.onChangeTrue(document.getElementById('iftrue'));
	glob.onChangeFalse(document.getElementById('iffalse'));
},

action: function(cache) {
	const data = cache.actions[cache.index];
	const msg = cache.msg;
	const separator = this.getDBM().Files.data.settings.separator;
	let result = false;
	if(msg && msg.content.length > 0) {
		const condition = parseInt(data.condition);
		let value = 0;
		switch(condition) {
			case 0:
				value = msg.content.split(new RegExp(separator)).length - 1;
				break;
			case 1:
				value = msg.mentions.members.array().length;
				break;
			case 2:
				value = msg.mentions.channels.array().length;
				break;
			case 3:
				value = msg.mentions.roles.array().length;
				break;
		}
		const comparison = parseInt(data.comparison);
		const value2 = parseInt(data.value);
		switch(comparison) {
			case 0:
				result = Boolean(value == value2);
				break;
			case 1:
				result = Boolean(value < value2);
				break;
			case 2:
				result = Boolean(value > value2);
				break;
			case 3:
				result = Boolean(value <= value2);
				break;
			case 4:
				result = Boolean(value >= value2);
				break;
		}
	}
	this.executeResults(result, data, cache);
},

mod: function(DBM) {
}

};