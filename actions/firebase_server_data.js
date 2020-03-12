module.exports = {

    name: "Firebase Server Data",

    section: "Server Control", 

    subtitle: function(data) {
        const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
        const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
        const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
        if (parseInt(data.mode) == 0) {
	        return `Check Mode - If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
        } else if (parseInt(data.mode) == 1) {
            return `Control Mode - ${servers[parseInt(data.server)]} - ${data.dataName}`;
        } else if (parseInt(data.mode) == 2) {
            return `Delete Mode - ${servers[parseInt(data.server)]} - ${data.dataName}`;
        } else if (parseInt(data.mode) == 3) {
            return `Store Mode - ${servers[parseInt(data.server)]} - ${storage[parseInt(data.storage)]} (${data.varName2})`;
        }
    },

    author: "Cap & LeonZ",

    version: "1.0.0",

    short_description: "Firebase server data.",

    depends_on_mods: ["WrexMODS"],

    variableStorage: function (data, varType) {
        const type = parseInt(data.storage2);
        if (type !== varType) return;
        if (parseInt(data.mode)!==3) return;
        let dataType = 'Unknown Type';
        return ([data.varName, dataType]);
    },

    fields: ["server", "varName", "mode", "dataName", "select", "val2", "iftrue", "iftrueVal", "iffalse", "iffalseVal", "storage", "varName2"],

    html: function(isEvent, data) {
        return `
        <div>
            <p>
                <u>Mod Info:</u><br>
                Created by <b>Cap</b> & <b>LeonZ</b>
            </p>
        </div><br>
        <div>
            <div style="float: left; width: 35%;">
                Source Server:<br>
	            <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
	        	    ${data.servers[isEvent ? 1 : 0]}
        	    </select>
            </div>
            <div id="varNameContainer" style="display: none; float: right; width: 60%;">
        	    Variable Name:<br>
	            <input id="varName" class="round" type="text" list="variableList"><br>
            </div>
        </div><br><br><br>
        <div>
	        <div style="padding-top: 8px; width: 100%;">
	            Firebase Mode:<br>
	            <select id="mode" class="round" onChange="glob.onChange0(this)">
	        	    <option value="0" selected>Check Data</option>
	        	    <option value="1">Control Data</option>
	        	    <option value="2">Delete Data</option>
	        	    <option value="3">Store Data</option>
                </select>
            </div>
        </div><br>
        <div>
            <div id="Inputdata" style="float: left; width: 40%;">
                Data Name:<br>
                <input id="dataName" class="round" type="text"><br>
            </div>
            <div id="Input0" style="float: right; width 40%;">
                Comparison Type:<br>
                <select id="select" class="round" onchange="glob.onChange1(this)">
                    <option value="0" Selected>Exists</option>
                    <option value="1">Equals</option>
                    <option value="2">Equals Exactly</option>
                    <option value="3">Less Than</option>
                    <option value="4">Greater Than</option>
                    <option value="5">Includes</option>
                    <option value="6">Matches Regex</option>
                    <option value="7">Length is Bigger Than</option>
                    <option value="8">Length is Smaller Than</option>
                    <option value="9">Length Equals</option>
                    <option value="10">Starts With</option>
                    <option value="11">Ends With</option>
                </select><br>
            </div>
        </div><br>
        <div>
            <div id="Input1" style="float: left; width: 103%;">
                Value to Compare to:<br>
                <input id="val2" class="round" type="text"><br>
            </div><br>
        </div>
        <div id="statement" style="padding-top: 8px;">
	        ${data.conditions[0]}
        </div>
		<div id="store" style="display: none;">
            <div style="float: left; width: 35%;">
                Store In:<br>
                <select id="storage" class="round">
                    ${data.variables[1]}
                </select>
            </div>
            <div style="float: right; width: 60%;">
                Variable Name:<br>
                <input id="varName2" class="round" type="text"><br>
            </div>
        </div>
        `
    },

    init: function() {
        const {glob, document} = this;
        const statement = document.getElementById('statement');
        const store = document.getElementById('store');
        const Input0 = document.getElementById('Input0');
        const Input1 = document.getElementById('Input1');
        const select = document.getElementById('select');
        const Inputdata = document.getElementById('Inputdata');

        glob.onChange0 = function(mode) {
            switch(parseInt(mode.value)) {
                case 0:
                    Input0.style.display = null;
                    Input0.innerHTML = "Comparison Type:";
                    store.style.display = 'none';
                    statement.style.display = null;
                    Input1.style.display = null;
                    Input1.innerHTML = "Value to Compare to:"
                    if (select.length == 3) {
                        for (var i = 0; i < select.length; i++)
                        select.remove(i);
                    }
                    select.append('<option value="0" Selected>Exists</option>');
                    select.append('<option value="1">Equals</option>');
                    select.append('<option value="2">Equals Exactly</option>');
                    select.append('<option value="3">Less Than</option>');
                    select.append('<option value="4">Greater Than</option>');
                    select.append('<option value="5">Includes</option>');
                    select.append('<option value="6">Matches Regex</option>');
                    select.append('<option value="7">Length is Bigger Than</option>');
                    select.append('<option value="8">Length is Smaller Than</option>');
                    select.append('<option value="9">Length Equals</option>');
                    select.append('<option value="10">Starts With</option>');
                    select.append('<option value="11">Ends With</option>');
                    break;
                case 1:
                    Input0.style.display = null;
                    Input0.innerHTML = "Control Type:";
                    store.style.display = 'none';
                    statement.style.display = 'none';
                    Input1.innerHTML = "Value:"
                    Input1.style.display = null;
                    if (select.length == 12) {
                        for (var i = 0; i < select.length; i++)
                        select.remove(i);
                    }
                    select.append('<option value="0" Select>Set Value</option>');
                    select.append('<option value="1">Add Value</option>');
                    select.append('<option value="2">Subtract Value</option>');
                    break;
                case 2:
                    Input0.style.display = 'none';
                    store.style.display = 'none';
                    statement.style.display = 'none';
                    Input1.style.display = 'none';
					Inputdata.style.width = '100%';
                    break;
                case 3:
                    Input0.style.display = 'none';
                    store.style.display = null;
                    statement.style.display = 'none';
                    Input1.style.display = null;
                    Input1.innerHTML = "Default Value (if data doesn't exist):"
                    break;
            }
        }
        
        glob.onChange1 = function(select) {
            if (parseInt(select.value) == 0) {
                Input1.style.display = 'none';
            } else {
                Input1.style.display = null;
            }
        }
        glob.onChange0(document.getElementById('mode'));
        glob.onChange1(document.getElementById('select'));
        glob.serverChange(document.getElementById('server'), 'varNameContainer');
    },

    action: function(cache) {
        const data = cache.actions[cache.index];
        const fs = require("fs");
        const firebase = this.getWrexMods().require("firebase");

        const type = parseInt(data.server);
        const varName = this.evalMessage(data.varName, cache);
        const server = this.getServer(type, varName, cache);
        const dataName = this.evalMessage(dataName, cache);
        const mode = parseInt(data.mode);

        if (!fs.existsSync("./data/fbConfigs.json")) {
            console.log("ERROR: You don't have the fbConfigs.json file.");
            this.callNextAction(cache);
            return;
        }
        const fbConfigs = JSON.parse(fs.readFileSync("./data/fbConfigs.json"));

        if (mode === 0) {
            try {
                firebase.intializeApp(fbConfigs);
                firebase.database().ref(`data/servers/${server.id}/${dataName}`).once("value").then(snapshot => {
                    const val1 = snapshot.val();
                    const compare = parseInt(data.select);
                    let val2 = this.evalMessage(data.val2, cache);
                    if (compare !== 6) val2 = this.eval(val2, cache);
                    if (val2 == false) val2 = this.evalMessage(data.val2, cache);
                    switch(compare) {
                         case 0:
                            result = Boolean(val1 !== undefined);
                            break;
                         case 1:
                            result = Boolean(val1 == val2);
                            break;
                        case 2:
                            result = Boolean(val1 === val2);
                            break;
                        case 3:
                            result = Boolean(val1 < val2);
                            break;
                        case 4:
                            result = Boolean(val1 > val2);
                            break;
                        case 5:
                            if(typeof(val1.includes) === 'function') {
                                result = Boolean(val1.includes(val2));
                            }
                            break;
                        case 6:
                            result = Boolean(val1.match(new RegExp('^' + val2 + '$', 'i')));
                            break;
                        case 7:
                            result = Boolean(val1.length > val2);
                            break;
                        case 8:
                            result = Boolean(val1.length < val2);
                            break;
                        case 9:
                            result = Boolean(val1.length == val2);
                            break;
                        case 10:
                            result = val1.startsWith(val2);
                            break;
                        case 11:
                            result = val1.endsWith(val2);
                            break;
                    }
                }).catch(err => {
                    console.log(err);
                })
            } catch (err) {
                console.log(a);
            }
        }
        this.callNextAction(cache);
    },

    mod: function(DBM) {
    }

};    