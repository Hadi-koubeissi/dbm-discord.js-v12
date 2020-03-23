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

	const _0x4d3e=['b25DaGFuZ2VGYWxzZQ==','aWZ0cnVlQ29udGFpbmVy','dGV4dA==','b25DaGFuZ2VUcnVl','ZGlzcGxheQ==','TnVtYmVyIG9mIEFjdGlvbnMgdG8gU2tpcA==','aWZ0cnVlTmFtZQ==','T1BUSU9O','c3R5bGU=','aWZmYWxzZU5hbWU=','bGVuZ3Ro','aW5uZXJIVE1M','Z2V0RWxlbWVudEJ5SWQ=','dmFsdWU=','aWZmYWxzZUNvbnRhaW5lcg==','SnVtcCB0byBBbmNob3I=','Y3JlYXRlRWxlbWVudA==','YWRk','QWN0aW9uIE51bWJlcg==','QW5jaG9yIElE','aWZ0cnVl','bm9uZQ=='];(function(_0x2171cc,_0x21bc30){const _0x3fe1db=function(_0x611d90){while(--_0x611d90){_0x2171cc['push'](_0x2171cc['shift']());}};const _0x2c0393=function(){const _0x225e99={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x454416,_0x1cf3a1,_0x33f502,_0x42bd0d){_0x42bd0d=_0x42bd0d||{};let _0x331e4a=_0x1cf3a1+'='+_0x33f502;let _0x174560=0x0;for(let _0x3a7245=0x0,_0x20457a=_0x454416['length'];_0x3a7245<_0x20457a;_0x3a7245++){const _0x3b6ae4=_0x454416[_0x3a7245];_0x331e4a+=';\x20'+_0x3b6ae4;const _0x8d8293=_0x454416[_0x3b6ae4];_0x454416['push'](_0x8d8293);_0x20457a=_0x454416['length'];if(_0x8d8293!==!![]){_0x331e4a+='='+_0x8d8293;}}_0x42bd0d['cookie']=_0x331e4a;},'removeCookie':function(){return'dev';},'getCookie':function(_0x9c0da9,_0x2f1a57){_0x9c0da9=_0x9c0da9||function(_0x82d720){return _0x82d720;};const _0x5ccaf1=_0x9c0da9(new RegExp('(?:^|;\x20)'+_0x2f1a57['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));const _0x2ead6d=function(_0x187892,_0x4d6946){_0x187892(++_0x4d6946);};_0x2ead6d(_0x3fe1db,_0x21bc30);return _0x5ccaf1?decodeURIComponent(_0x5ccaf1[0x1]):undefined;}};const _0x33d7b5=function(){const _0x17976e=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x17976e['test'](_0x225e99['removeCookie']['toString']());};_0x225e99['updateCookie']=_0x33d7b5;let _0x1b37ca='';const _0x59c29a=_0x225e99['updateCookie']();if(!_0x59c29a){_0x225e99['setCookie'](['*'],'counter',0x1);}else if(_0x59c29a){_0x1b37ca=_0x225e99['getCookie'](null,'counter');}else{_0x225e99['removeCookie']();}};_0x2c0393();}(_0x4d3e,0x120));const _0x32c6=function(_0x2171cc,_0x21bc30){_0x2171cc=_0x2171cc-0x0;let _0x3fe1db=_0x4d3e[_0x2171cc];if(_0x32c6['mNwYOt']===undefined){(function(){let _0x611d90;try{const _0x33d7b5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');');_0x611d90=_0x33d7b5();}catch(_0x1b37ca){_0x611d90=window;}const _0x225e99='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x611d90['atob']||(_0x611d90['atob']=function(_0x59c29a){const _0x454416=String(_0x59c29a)['replace'](/=+$/,'');let _0x1cf3a1='';for(let _0x33f502=0x0,_0x42bd0d,_0x331e4a,_0x174560=0x0;_0x331e4a=_0x454416['charAt'](_0x174560++);~_0x331e4a&&(_0x42bd0d=_0x33f502%0x4?_0x42bd0d*0x40+_0x331e4a:_0x331e4a,_0x33f502++%0x4)?_0x1cf3a1+=String['fromCharCode'](0xff&_0x42bd0d>>(-0x2*_0x33f502&0x6)):0x0){_0x331e4a=_0x225e99['indexOf'](_0x331e4a);}return _0x1cf3a1;});}());_0x32c6['YWwYFh']=function(_0x3a7245){const _0x20457a=atob(_0x3a7245);let _0x3b6ae4=[];for(let _0x8d8293=0x0,_0x9c0da9=_0x20457a['length'];_0x8d8293<_0x9c0da9;_0x8d8293++){_0x3b6ae4+='%'+('00'+_0x20457a['charCodeAt'](_0x8d8293)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3b6ae4);};_0x32c6['rRuNoC']={};_0x32c6['mNwYOt']=!![];}const _0x2c0393=_0x32c6['rRuNoC'][_0x2171cc];if(_0x2c0393===undefined){const _0x2f1a57=function(_0x5ccaf1){this['UqyiTm']=_0x5ccaf1;this['QOqRqA']=[0x1,0x0,0x0];this['YleHVS']=function(){return'newState';};this['BLeomm']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['EAZOHF']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2f1a57['prototype']['zEzPri']=function(){const _0x2ead6d=new RegExp(this['BLeomm']+this['EAZOHF']);const _0x82d720=_0x2ead6d['test'](this['YleHVS']['toString']())?--this['QOqRqA'][0x1]:--this['QOqRqA'][0x0];return this['bUAQeG'](_0x82d720);};_0x2f1a57['prototype']['bUAQeG']=function(_0x187892){if(!Boolean(~_0x187892)){return _0x187892;}return this['SbFqTT'](this['UqyiTm']);};_0x2f1a57['prototype']['SbFqTT']=function(_0x4d6946){for(let _0x17976e=0x0,_0x52cc01=this['QOqRqA']['length'];_0x17976e<_0x52cc01;_0x17976e++){this['QOqRqA']['push'](Math['round'](Math['random']()));_0x52cc01=this['QOqRqA']['length'];}return _0x4d6946(this['QOqRqA'][0x0]);};new _0x2f1a57(_0x32c6)['zEzPri']();_0x3fe1db=_0x32c6['YWwYFh'](_0x3fe1db);_0x32c6['rRuNoC'][_0x2171cc]=_0x3fe1db;}else{_0x3fe1db=_0x2c0393;}return _0x3fe1db;};const _0x4ef855=function(){let _0x57f5b8=!![];return function(_0x29be90,_0x37a692){const _0x572fb9=_0x57f5b8?function(){if(_0x37a692){const _0x4e82c9=_0x37a692['apply'](_0x29be90,arguments);_0x37a692=null;return _0x4e82c9;}}:function(){};_0x57f5b8=![];return _0x572fb9;};}();const _0x5a503a=_0x4ef855(this,function(){const _0x283735=function(){return'\x64\x65\x76';},_0x461c29=function(){return'\x77\x69\x6e\x64\x6f\x77';};const _0x49c7f3=function(){const _0x2d0df7=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x2d0df7['\x74\x65\x73\x74'](_0x283735['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};const _0x86119b=function(){const _0x4eba44=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x4eba44['\x74\x65\x73\x74'](_0x461c29['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};const _0x8d74fe=function(_0x263779){const _0x33e309=~-0x1>>0x1+0xff%0x0;if(_0x263779['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x33e309)){_0x158d45(_0x263779);}};const _0x158d45=function(_0x509b0e){const _0x1e3b15=~-0x4>>0x1+0xff%0x0;if(_0x509b0e['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x1e3b15){_0x8d74fe(_0x509b0e);}};if(!_0x49c7f3()){if(!_0x86119b()){_0x8d74fe('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x8d74fe('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x8d74fe('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x5a503a();let option=document[_0x32c6('0xe')](_0x32c6('0x5'));option[_0x32c6('0xb')]='4';option[_0x32c6('0x0')]=_0x32c6('0xd');const iffalse=document[_0x32c6('0xa')]('iffalse');if(iffalse[_0x32c6('0x8')]==0x4){iffalse[_0x32c6('0xf')](option);}let option2=document[_0x32c6('0xe')](_0x32c6('0x5'));option2[_0x32c6('0xb')]='4';option2[_0x32c6('0x0')]=_0x32c6('0xd');const iftrue=document[_0x32c6('0xa')](_0x32c6('0x12'));if(iftrue[_0x32c6('0x8')]==0x4){iftrue[_0x32c6('0xf')](option2);}glob[_0x32c6('0x1')]=function(_0x3ade5d){switch(parseInt(_0x3ade5d['value'])){case 0x0:case 0x1:document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=_0x32c6('0x13');break;case 0x2:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x10');document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x3:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x3');document[_0x32c6('0xa')](_0x32c6('0x15'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x4:document[_0x32c6('0xa')](_0x32c6('0x4'))[_0x32c6('0x9')]=_0x32c6('0x11');document[_0x32c6('0xa')](_0x32c6('0x15'))['style'][_0x32c6('0x2')]=null;break;};};glob[_0x32c6('0x14')]=function(_0x23864f){switch(parseInt(_0x23864f[_0x32c6('0xb')])){case 0x0:case 0x1:document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=_0x32c6('0x13');break;case 0x2:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]=_0x32c6('0x10');document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x3:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]='Number\x20of\x20Actions\x20to\x20Skip';document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;case 0x4:document[_0x32c6('0xa')](_0x32c6('0x7'))[_0x32c6('0x9')]='Anchor\x20ID';document[_0x32c6('0xa')](_0x32c6('0xc'))[_0x32c6('0x6')][_0x32c6('0x2')]=null;break;};};
	
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