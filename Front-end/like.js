try{
  var buttons =  document.getElementsByTagName("button")[3];
  if(buttons.className.indexOf("likeButton") > -1){
  buttons.click();
  }
}
catch(err){
  console.log(err.message);
}
