const LeonZ = {};

const Canvas = require('canvas');
const openType = require('opentype.js');
const fs = require("fs");
const discord = require("discord.js");

LeonZ.canvasAttachment = function (path, name) {
	const image = LeonZ.loadImage(path);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image,0,0, image.width, image.height);
	if (!name) {
		name = 'image.png';
	}
	const buffer = canvas.toBuffer('image/png', {compressionLevel:10});
	const attachment = new discord.MessageAttachment	(buffer, name);
	return attachment;
}

LeonZ.createImage = function (path) {
	const data = Canvas.loadImage(path).then(function(image) {
		const canvas = Canvas.createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		ctx.drawImage(image,0,0,image.width,image.height);
		return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	})
	return data;
}

LeonZ.cropImage = function (path, options) {
	const image = LeonZ.loadImage(path);
	if (options.width.endsWith("%")) {
		options.width = image.width * parseFloat(options.width) / 100;
	}
	if (options.height.endsWith("%")) {
		options.height = image.height * parseFloat(options.height) / 100;
	}
	if (options.height > image.height) {
		options.height = image.height;
	}
	if (options.width > image.width) {
		options.width = image.width;
	}
	let x, y;
	switch (options.align) {
		case 0:
			x = 0;
			y = 0;
			break;
		case 1:
			x = (options.width / 2) - (image.width / 2);
			y = 0;
			break;
		case 2:
			x = options.width - image.width;
			y = 0;
			break;
		case 3:
			x = 0;
			y = (options.height / 2) - (image.height / 2);
			break;
		case 4:
			x = (options.width / 2) - (image.width / 2);
			y = (options.height / 2) - (image.height / 2);
			break;
		case 5:
			x = options.width - image.width;
			y = (options.height / 2) - (image.height / 2);
			break;
		case 6:
			x = 0;
			y = options.height - image.height;
			break;
		case 7:
			x = (options.width / 2) - (image.width / 2);
			y = options.height - image.height;
			break;
		case 8:
			x = options.width - image.width;
			y = options.height - image.height;
			break;
	}
	const canvas = Canvas.createCanvas(options.width, options.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, x, y, image.width, image.height);
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.drawImage = function (path, path2, options) {
	const image = LeonZ.loadImage(path);
	const image2 = LeonZ.loadImage(path2);
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	if (options.effect && options.effect == "mask") {
		ctx.globalCompositeOperation = 'destination-out';
	}
	if (!options.x) {
		options.x = 0;
	}
	if (!options.y) {
		options.y = 0;
	}
	ctx.drawImage(image2, options.x, options.y, image2.width, image2.height)
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.drawText = function (path, options) {
	const image = LeonZ.loadImage(path);
	if (!options.color) {
		options.color = "#000000";
	} else if (!options.color.startsWith("#")) {
		options.color = "#" + options.color;
	}
	if (!options.size) {
		options.size = 10;
	}
	if (!options.x) {
		options.x = 0;
	}
	if (!options.y) {
		options.y = 0;
	}
	const canvas = Canvas.createCanvas(image.width, image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const font = openType.loadSync(options.font);
	const textpath = font.getPath(options.text,0,0, options.size);
	const width = textpath.getBoundingBox().x2 - textpath.getBoundingBox().x1;
	const height = textpath.getBoundingBox().y2 - textpath.getBoundingBox().y1;
	switch (options.align) {
		case 1:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
		case 2:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
		case 3:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 4:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 5:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= height / 2 + textpath.getBoundingBox().y1;
			break;
		case 6:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
			break;
		case 7:
			options.x -= width / 2 + textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
			break;
		case 8:
			options.x -= width + textpath.getBoundingBox().x1;
			options.y -= height + textpath.getBoundingBox().y1;
		case 0:
		default:
			options.x -= textpath.getBoundingBox().x1;
			options.y -= textpath.getBoundingBox().y1;
			break;
	};
	const textholder = font.getPath(options.text, options.x, options.y, options.size);
	textholder.fill = options.color;
	textholder.draw(ctx);
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.editBorder = function (path, options) {
	const image = LeonZ.loadImage(path);
	let canvas;
	if (options.type == "circle") {
		if (!options.radius && isNaN(options.radius) || options.radius * 2 > image.width && options.radius * 2 > image.height) {
			let max;
			if (image.width > image.height) {
				max = image.height;
			} else {
				max = image.width;
			}
			options.radius = max / 2;
		}
		canvas = Canvas.createCanvas(options.radius * 2,options.radius * 2);
		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.arc(options.radius, options.radius, options.radius, 0, Math.PI * 2);
		ctx.closePath();
		ctx.clip();
		let x = 0;
		let y = 0;
		if (options.radius * 2 < image.width) {
			x -= image.width / 2 - options.radius;
		}
		if (options.radius * 2 < image.height) {
			y -= image.height / 2 - options.radius;
		}
		ctx.drawImage(image, x, y, image.width, image.height);
	} else if (options.type == "round") {
		canvas = Canvas.createCanvas(image.width,image.height);
		const ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(options.radius,0);
		ctx.lineTo(image.width-options.radius,0);
		ctx.quadraticCurveTo(image.width,0,image.width,options.radius);
		ctx.lineTo(image.width,image.height-options.radius);
		ctx.quadraticCurveTo(image.width,image.height,image.width-options.radius,image.height);
		ctx.lineTo(options.radius,image.height);
		ctx.quadraticCurveTo(0,image.height,0,image.height-options.radius);
		ctx.lineTo(0,options.radius);
		ctx.quadraticCurveTo(0,0,options.radius,0);
		ctx.closePath();
		ctx.clip();
		ctx.drawImage(image, 0, 0, image.width, image.height);
	}
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.flipImage = function (path, flip) {
	const image = LeonZ.loadImage(path);
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,image.width,image.height);
	ctx.save();
	ctx.translate(image.width / 2, image.height / 2);
	switch (parseInt(flip)) {
		case 0:
			ctx.scale(-1,1);
			break;
		case 1:
			ctx.scale(1,-1);
			break;
		case 2:
			ctx.scale(-1,-1);
			break;
	}
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.generateProgress = function (options) {
	let canvas;
	if (options.type == 0) {
		canvas = Canvas.createCanvas(options.width, options.height);
	} else if (options.type == 1) {
		canvas = Canvas.createCanvas(options.size, options.size);
	}
	const ctx = canvas.getContext('2d');
	if (!options.color) {
		ctx.strokeStyle = "#000000";
	} else if (!options.color.startsWith("#")) {
		ctx.strokeStyle = "#" + options.color;
	} else {
		ctx.strokeStyle = options.color;
	}
	ctx.lineWidth = options.lineWidth;
	ctx.lineCap = options.lineCap;
	switch (options.type) {
		case 0:
			ctx.beginPath();
			switch (options.lineCap) {
				case "square":
					ctx.moveTo(0, options.height/2);
					ctx.lineTo(options.width*options.percent/100, options.height/2);
					break;
				case "round":
					let center = options.lineWidth/2;
					let top = options.height/2-center;
					let bottom = options.height/2+center;
					ctx.moveTo(center,top);
					ctx.lineTo(options.width-options.lineWidth,top);
					ctx.arcTo(options.width,top,options.width,options.height/2,center);
					ctx.arcTo(options.width,bottom,top,bottom,center);
					ctx.lineTo(center,bottom);
					ctx.arcTo(0,bottom,0,options.height/2,center);
					ctx.arcTo(0,top,center,top,center);
					ctx.closePath();
					ctx.clip();
					ctx.beginPath();
					ctx.moveTo(-center, options.height/2);
					ctx.lineTo(options.width*options.percent/100-center, options.height/2);
					break;
			}
			break;
		case 1:
			ctx.translate(options.size/2, options.size/2);
			ctx.rotate(-0.5 * Math.PI);
			ctx.beginPath();
			ctx.arc(0, 0, options.radius, 0, Math.PI * 2 * options.percent / 100, false);
			break;
	}
	ctx.stroke();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.loadImage = function (path) {
	const image = new Canvas.Image();
	image.src = path;
	return image;
}

LeonZ.resizeImage = function (path, options) {
	const image = LeonZ.loadImage(path);
	if (!options.aspectRatio || typeof options.aspectRatio != "boolean") {
		options.aspectRatio = false;
	}
	if (options.aspectRatio) {
		if (options.width && options.height) {
			if (!isNaN(options.width)) {
				options.scaleWidth = options.width / image.width;
			} else if (options.width.endsWith("%")) {
				options.scaleWidth = parseFloat(options.width) / 100;
			}
			if (!isNaN(options.height)) {
				options.scaleHeight = options.height / image.height;
			} else if (options.height.endsWith("%")) {
				options.scaleHeight = parseFloat(options.height) / 100;
			}
		} else if (options.width) {
			if (!isNaN(options.width)) {
				options.scaleWidth = options.width / image.width;
				options.scaleHeight = options.scaleWidth;
			} else if (options.width.endsWith("%")) {
				options.scaleWidth = parseFloat(options.width) / 100;
				options.scaleHeight = options.scaleWidth;
			}
		} else if (options.height) {
			if (!isNaN(options.height)) {
				options.scaleHeight = options.height / image.height;
				options.scaleWidth = options.scaleHeight;
			} else if (options.height.endsWith("%")) {
				options.scaleHeight = parseFloat(options.height) / 100;
				options.scaleWidth = options.scaleHeight;
			}
		}
	} else {
		if (options.width && !isNaN(options.width)) {
			options.scaleWidth = options.width / image.width;
		} else if (options.width && options.width.endsWith("%")) {
			options.scaleWidth = parseFloat(options.width) / 100;
		}
		if (options.height && !isNaN(options.height)) {
			options.scaleHeight = options.height / image.height;
		} else if (options.height && options.height.endsWith("%")) {
			options.scaleHeight = parseFloat(options.height) / 100;
		}
	}
	if (!options.scaleHeight) {
		options.scaleHeight =1;
	}
	if (!options.scaleWidth) {
		options.scaleWidth =1;
	}
	const canvas = Canvas.createCanvas(image.width*options.scaleWidth,image.height*options.scaleHeight);
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0,0);
	ctx.save();
	ctx.translate(image.width*options.scaleWidth / 2, image.height*options.scaleHeight / 2);
	ctx.scale(options.scaleWidth, options.scaleHeight);
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

LeonZ.rotateImage = function (path, degree) {
	const radian = Math.PI / 180 * degree;
	const image = LeonZ.loadImage(path);
	let imageWidth = image.width * Math.abs(Math.cos(radian)) + image.height * Math.abs(Math.sin(radian));
	let imageHeight = image.height * Math.abs(Math.cos(radian)) + image.width * Math.abs(Math.sin(radian));
	const canvas = Canvas.createCanvas(imageWidth, imageHeight);
	const ctx = canvas.getContext('2d');
	ctx.save();
	ctx.translate(imageWidth / 2, imageHeight / 2);
	ctx.rotate(radian);
	ctx.drawImage(image, -image.width/2, -image.height/2, image.width, image.height);
	ctx.restore();
	return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	
}

LeonZ.saveImage = function (path, localPath) {
	const image = LeonZ.loadImage(path);
	const canvas = Canvas.createCanvas(image.width,image.height);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
	const buffer = canvas.toBuffer();
	fs.writeFileSync(localPath,buffer);
}

const canvasJS = {};

canvasJS.mod = function(DBM) {
	
	DBM.CanvasJS = function () {
		return LeonZ;
	};
};

module.exports = canvasJS;