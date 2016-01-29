(function( window ){
    
    'use strict';
    
    var body = document.body,
    wrapper = document.getElementById("wrapper"),
    toggleMenu = document.getElementById("toggleMenu"),
    create = document.getElementById("new"),
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
    
    var parse_flag = false;

    function menuToggler () {
	if (typeof menu !== 'undefined'){
	    if (!menu){
		/* show */
		// console.log("show");
		wrapper.style.left="10em";
		nav.style.left="0";

		body.appendChild(mask);
		menu = true;
	    } else {
		/* hide */
		// console.log("hide");
		wrapper.style.left="0";
		nav.style.left="-15em";
		while (mask.hasChildNodes()) {
		    mask.removeChild(mask.lastChild);
		}
		body.removeChild(mask);
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
	if (typeof menu !== 'undefined') {
	    menu = (menu ? menu : true )
	    menuToggler();
	} else {
	    while (mask.hasChildNodes()) {
		mask.removeChild(mask.lastChild);
	    }
	    body.removeChild(mask);
	}
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
    /* new md file */
    create.addEventListener( "click", function(){
	menuToggler();
	if (window.location.hash != "") window.location.hash = "";
        mdtext.value = "";
    } );
    /* open md file */
    open.addEventListener( "click", function(){
	menuToggler();
	while (mask.hasChildNodes()) {
	    mask.removeChild(mask.lastChild);
	}
 	body.appendChild(mask);

	var dialog = document.createElement("div");
	dialog.id = "dialog";
	var ul = document.createElement("ul");
	
	var xmlhttp,
	data = new FormData();
	
	if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
	else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
	
	data.append('dir', "md");
	xmlhttp.open("POST","processor.php",true);
	xmlhttp.send(data);
	
	xmlhttp.onreadystatechange=function() {
	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		var data = eval("(" + xmlhttp.responseText + ")");

		data.forEach(function(entry) {
		    var li = document.createElement("li");
		    if (entry != "no files") {
			li.addEventListener( "click", function() {
			    window.location.hash = entry.split(".")[0];
			    var xmlhttp,
			    data = new FormData();
			    
			    if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
			    else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			    
			    data.append('open', entry );
			    xmlhttp.open("POST","processor.php",true);
			    xmlhttp.send(data);
			    
			    xmlhttp.onreadystatechange=function() {
				mdtext.value = xmlhttp.responseText;
			    }
			    
			    
			} );
		    }
		    li.innerHTML = entry;
		    ul.appendChild(li);
		});
	    }
	}
	dialog.appendChild(ul);
	mask.appendChild(dialog);
    } );
    /* save md file */
    save.addEventListener( "click", function(){
	menuToggler();
	if (window.location.hash == "") {
	    while (mask.hasChildNodes()) {
		mask.removeChild(mask.lastChild);
	    }
 	    body.appendChild(mask);
	    var dialog = document.createElement("div");
	    dialog.id = "dialog";
	    dialog.innerHTML = "Введите имя файла без расширения: "
	    var input = document.createElement("input");
	    input.setAttribute('type',"text");
	    input.setAttribute('id',"filename");
	    var button =  document.createElement("button");
	    button.innerHTML = "Сохранить";

	    button.addEventListener( "click", function(){
		if (input.value != "") {
		    window.location.hash = input.value;
		    while (mask.hasChildNodes()) {
			mask.removeChild(mask.lastChild);
		    }
		    body.removeChild(mask);
		    finaly_save();
		}

	    } );

	    dialog.appendChild(input);
	    dialog.appendChild(button);
	    
	    dialog.addEventListener( "click", function(event){
		event.preventDefault();
		event.stopPropagation();
	    } );
	    
	    mask.appendChild(dialog);

	} else {finaly_save();}

    } );

    function finaly_save () {
	var xmlhttp,
	md = mdtext.value,
	data = new FormData()
	;
	
	if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
	else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
	
	data.append('save',  window.location.hash.replace("#","")+".md");
	data.append('mdtext', md);
	xmlhttp.open("POST","processor.php",true);
	xmlhttp.send(data);
	
	xmlhttp.onreadystatechange=function() {
	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		var dialog = document.createElement("div");
		dialog.id = "dialog";
		dialog.innerHTML = xmlhttp.responseText;
		body.appendChild(mask);
		mask.appendChild(dialog);
		setTimeout(function() {
		    while (mask.hasChildNodes()) {
			mask.removeChild(mask.lastChild);
		    }
		    body.removeChild(mask);
		}, 1000);
	    }
	}
    }
    /* save html file */
    publish.addEventListener( "click", function(){
	menuToggler();
	while (mask.hasChildNodes()) {
	    mask.removeChild(mask.lastChild);
	}
	
	if (parse_flag) {
	    var xmlhttp,
	    md = mdtext.value,
	    data = new FormData()
	    ;
	    
	    if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
	    else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
	
	    data.append('publish',  window.location.hash.replace("#","")+".html");
	    data.append('mdtext', md);
	    xmlhttp.open("POST","processor.php",true);
	    xmlhttp.send(data);
	    
	    xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		    var dialog = document.createElement("div");
		    dialog.id = "dialog";
		    dialog.innerHTML = xmlhttp.responseText;
		    body.appendChild(mask);
		    mask.appendChild(dialog);
		    setTimeout(function() {
		        while (mask.hasChildNodes()) {
		    	mask.removeChild(mask.lastChild);
		        }
		        body.removeChild(mask);
		    }, 1000);
		}
	    }
	    
	}/*if*/
	
    } );
    /* show help */
    help.addEventListener( "click", function(){
	menuToggler();
	while (mask.hasChildNodes()) {
	    mask.removeChild(mask.lastChild);
	}
	body.appendChild(mask);

	var dialog = document.createElement("div");
	dialog.id = "dialog";

	var xmlhttp;
	
	if (window.XMLHttpRequest) { xmlhttp=new XMLHttpRequest();}
	else { xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); }
	
	xmlhttp.open("GET","cs.html",true);
	xmlhttp.send();
	
	xmlhttp.onreadystatechange=function() {
	    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		dialog.innerHTML = xmlhttp.responseText;
	    }
	}

	mask.appendChild(dialog);
    } );
    /* parse md frm textarea */
    parse.addEventListener( "click", function(){
	parse_flag = true;
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
