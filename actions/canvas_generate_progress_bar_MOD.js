module.exports = {

	name: "Canvas Generate Progress Bar",

	section: "Image Editing",

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		const type = ["Basic", "Circle"];
		const index = parseInt(data.type);
		return `Generate ${type[index]} Progress Bar ${storeTypes[parseInt(data.storage)]} (${data.varName})`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Image']);
	},

	fields: ["storage", "varName", "type", "width", "height", "lineWidth", "lineCap", "percent", "color"],

	html: function(isEvent, data) {
		return `
	<div style="padding-top: 8px;">
		<div style="float: left; width: 45%;">
			Type:<br>
			<select id="type" class="round" onchange="glob.onChange1(this)">
				<option value="0" selected>Basic</option>
				<option value="1">Circle</option><br>
			</select>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 50%;">
			<div id="Change1text">Width:</div>
			<input id="width" class="round" type="text"><br>
		</div>
		<div style="float: right; width: 50%;">
			<div id="Change2text">Height:</div>
			<input id="height" class="round" type="text"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 50%;">
			Line Width:<br>
			<input id="lineWidth" class="round" type="text"><br>
		</div>
		<div style="padding-left: 1%; float: left; width: 45%;">
			Line Cap:<br>
			<select id="lineCap" class="round">
				<option value="0" selected>Square</option>
				<option value="1">Round</option>
			</select><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 50%;">
			Percent:<br>
			<input id="percent" class="round" type="text"><br>
		</div>
		<div style="float: right; width: 50%;">
			Color:<br>
			<input id="color" class="round" type="text" value="FFFFFF"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 45%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 50%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;
	
		glob.onChange1 = function(event) {
			const Change1text = document.getElementById("Change1text");
			const Change2text = document.getElementById("Change2text");
			if (event.value === "0") {
				Change1text.innerHTML = "Width:";
				Change2text.innerHTML = "Height:";
			} else if (event.value === "1") {
				Change1text.innerHTML = "Radius:";
				Change2text.innerHTML = "Size:";
			}
		}
		glob.onChange1(document.getElementById('type'));
	},

	action: function(cache) {
		const Canvas = require('canvas');
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const type = parseInt(data.type);
		const width = parseInt(data.width);
		const height = parseInt(data.height);
		const percent = this.evalMessage(data.percent, cache);
		const lineWidth = parseInt(data.lineWidth);
		const lineCap = parseInt(data.lineCap);
		let Cap;
		switch(lineCap) {
			case 0:
				Cap = "square";
				break;
			case 1:
				Cap = "round";
				break;
		}
		const color = this.evalMessage(data.color, cache);
		let canvas;
		if (type == 0) {
			canvas = Canvas.createCanvas(width,height);
		} else if (type == 1) {
			canvas = Canvas.createCanvas(height,height);
		}
		const ctx = canvas.getContext('2d');
		if (color.startsWith("#")) {
			ctx.strokeStyle = color;
		} else {
			ctx.strokeStyle = "#"+color;
		}
		ctx.lineWidth = lineWidth;
		if (type == 0) {
			ctx.beginPath();
			switch(lineCap) {
				case 0:
					ctx.moveTo(0, height/2);
					ctx.lineTo(width*percent/100, height/2);
					break;
				case 1:
					let center = lineWidth/2;
					let top = height/2-center;
					let bottom = height/2+center;
					ctx.moveTo(center,top);
					ctx.lineTo(width-lineWidth,top);
					ctx.arcTo(width,top,width,height/2,center);
					ctx.arcTo(width,bottom,top,bottom,center);
					ctx.lineTo(center,bottom);
					ctx.arcTo(0,bottom,0,height/2,center);
					ctx.arcTo(0,top,center,top,center);
					ctx.closePath();
					ctx.clip();
					ctx.beginPath();
					ctx.moveTo(-center, height/2);
					ctx.lineTo(width*percent/100-center, height/2);
					break;
			}
		} else if (type == 1) {
			ctx.translate(height / 2, height / 2);
			ctx.rotate(-0.5 * Math.PI);
			ctx.beginPath();
			ctx.arc(0, 0, width, 0, Math.PI * 2 * percent / 100, false);
		}
		ctx.lineCap = Cap;
		ctx.stroke();
		const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};