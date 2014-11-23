function parse() {
    var xmlhttp;

    if (window.XMLHttpRequest) {
	xmlhttp=new XMLHttpRequest();
    }
    else {
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    var md = document.getElementById("md").value;

    var data = new FormData();
    data.append('md', md);
    xmlhttp.open("POST","processor.php",true);
    xmlhttp.send(data);

    xmlhttp.onreadystatechange=function() {
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    document.getElementById("output").innerHTML = xmlhttp.responseText;
	}
    }
}

(function( window ){
    
    'use strict';
    
    var offset = "10em";
    
    var body = document.body,
    wrapper = document.getElementById("wrapper"),
    toggleMenu = document.getElementById("toggleMenu"),
    open = document.getElementById("open"),
    save = document.getElementById("save"),
    publish = document.getElementById("publish"),
    help = document.getElementById("help"),
    toggleView = document.getElementById("toggleView"),
    nav = document.getElementById("nav"),
    editor = document.getElementById("editor"),
    mdtext = document.getElementById("mdtext"),
    output = document.getElementById("output"),
    parse = document.getElementById("parse")
    ;
    
    var mask = document.createElement("div");
    mask.id = "mask";

    var menu;

    function menuToggler () {
	if (typeof menu !== 'undefined'){
	    if (!menu){
		/* show */
		console.log("show");
		wrapper.style.left=offset;
		nav.style.left="0";
		document.body.appendChild(mask);
		menu = true;
	    } else {
		/* hide */
		console.log("hide");
		wrapper.style.left="0";
		nav.style.left="-"+offset;
		document.body.removeChild(mask);
		menu = false
	    }
	}
    }

    /* toggle menu */
    toggleMenu.addEventListener( "click", function () {
	menu = (typeof menu == 'undefined') ? false : menu;
	menuToggler();
    } );

    /* hide menu if mask is clicked */
    mask.addEventListener( "click", function () {
	menu = (menu ? menu : true )
	menuToggler(); 
    } );

    /* toggle output or editor */
    toggleView.addEventListener( "click", function(){
	if (editor.style.display == "none") {
	    editor.style.display = "block"
	    output.style.display = "none"
	} else {
	    editor.style.display = "none"
	    output.style.display = "block"
	}
    } );
    open.addEventListener( "click", function(){
	menuToggler();
	output.innerHTML = "open";
    } );
    save.addEventListener( "click", function(){
	menuToggler();
	output.innerHTML = "save";

    } );
    publish.addEventListener( "click", function(){
	menuToggler();
	output.innerHTML = "publish";
    } );
    help.addEventListener( "click", function(){
	menuToggler();
	document.body.appendChild(mask);
	output.innerHTML = "help";
    } );

    parse.addEventListener( "click", function(){
	var xmlhttp,
	md = mdtext.value,
	data = new FormData()
	;
	
	if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
	else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
	
	data.append('md', md);
	xmlhttp.open("POST","processor.php",true);
	xmlhttp.send(data);
	
	xmlhttp.onreadystatechange=function() {
	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		output.innerHTML = xmlhttp.responseText;
	    }
	}
    } );
})( window );
