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

    // xmlhttp.open("GET","processor.php?md="+document.getElementById("md").value,true);
    xmlhttp.open("POST","processor.php",true);
    xmlhttp.send(data);
    // xmlhttp.send();

    xmlhttp.onreadystatechange=function() {
	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    document.getElementById("output").innerHTML = xmlhttp.responseText;
	}
    }
}

function show() {
    var editor = document.getElementById("editor");
    var output = document.getElementById("output");
    if (editor.style.display == "none") {
	editor.style.display = "block"
	output.style.display = "none"
    } else {
	editor.style.display = "none"
	output.style.display = "block"
    }
}



/**
 * The nav stuff
 */
(function( window ){
	
	'use strict';

		var offset = "10em";

		var body = document.body,
		wrapper = document.getElementById("wrapper"),
		mask = document.createElement("div"),
		toggleMenu = document.getElementById("toggleMenu"),
		nav = document.getElementById("nav")
		;
	mask.id = "mask";
	nav.style.left="-"+offset;
	nav.style.width=offset;
	nav.style.display="block";

	/* toggle menu */
	toggleMenu.addEventListener( "click", function(){
		if (wrapper.style.left == offset) {
			/* hide */
			wrapper.style.left="0";
			nav.style.left="-"+offset;
			document.body.removeChild(mask);
		} else {
			/* show */
			wrapper.style.left=offset;
			nav.style.left="0";
			document.body.appendChild(mask);
		}
	} );

	/* hide menu if mask is clicked */
	mask.addEventListener( "click", function(){
		wrapper.style.left="0";
		nav.style.left="-"+offset;
		document.body.removeChild(mask);
	} );

})( window );

