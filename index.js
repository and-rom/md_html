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
