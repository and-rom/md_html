<?php
include("Parsedown.php");
include("ParsedownExtra.php");

if (file_exists($_SERVER['DOCUMENT_ROOT']."/config.php")) {
		include($_SERVER['DOCUMENT_ROOT']."/config.php");
}
if (!defined("MDDIR")) {
  define ("MDDIR", $_SERVER['DOCUMENT_ROOT']."/");
}
if (!defined("HTMLDIR")) {
  define ("HTMLDIR", $_SERVER['DOCUMENT_ROOT']."/");
}

if (isset($_POST['md']) and !empty($_POST['md'])) {
  $Instance = new ParsedownExtra();
  echo $Instance->text($_POST['md']);
} elseif (isset($_POST['dir']) and !empty($_POST['dir'])) {
  if ($_POST['dir'] == "md") {
    $list = scandir("../".MDDIR);
  } elseif ($_POST['dir'] == "html") {
    $list = scandir("../".HTMLDIR);
  }
  unset($list[0]);
  unset($list[1]);
  (sizeof($list) > 0 ? $list=array_values($list) : array_push($list,"no files"));
  echo json_encode(array_values($list),JSON_UNESCAPED_UNICODE);
} else {
  echo "ERR\n";
  var_dump($_POST);
}

?>
