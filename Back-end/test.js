var page = require('webpage').create();

var fillLoginInfo = function(){
  	var frm = document.getElementById("login_form");
    frm.elements["email"].value = 'ss@ss.fr';
    frm.elements["pass"].value = 'password';
    frm.submit();
}

page.onLoadFinished = function(){
	if(page.title == "Welcome to Facebook - Log In, Sign Up or Learn More"){
		page.evaluate(fillLoginInfo);
		console.log("fail");
		return;
	}
	else
		page.render('./screens/some.png');
		console.log("completed");
	phantom.exit();
}

page.open('https://www.facebook.com/');
