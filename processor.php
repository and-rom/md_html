<?php
include("Parsedown.php");
include("ParsedownExtra.php");

if (file_exists($_SERVER['DOCUMENT_ROOT']."/config.php")) {
  include($_SERVER['DOCUMENT_ROOT']."/config.php");
}
if (!defined("MDDIR")) {
  define ("MDDIR", $_SERVER['DOCUMENT_ROOT']);
}
if (!defined("HTMLDIR")) {
  define ("HTMLDIR", $_SERVER['DOCUMENT_ROOT']);
}

if (isset($_POST['md']) and !empty($_POST['md'])) {
  /* parse md */
  $Instance = new ParsedownExtra();
  echo $Instance->text($_POST['md']);
}
elseif (isset($_POST['dir']) and !empty($_POST['dir'])) {
  /* show md dir contents */
  if ($_POST['dir'] == "md") {
    $list = scandir(MDDIR);
  } elseif ($_POST['dir'] == "html") {
    $list = scandir(HTMLDIR);
  }
  unset($list[0]);
  unset($list[1]);
  (sizeof($list) > 0 ? $list=array_values($list) : array_push($list,"no files"));
  echo json_encode(array_values($list),JSON_UNESCAPED_UNICODE);
} 
elseif (isset($_POST['open']) and !empty($_POST['open'])) {
  $file = MDDIR.$_POST['open'];
  if (file_exists($file)) {
    readfile($file);
  }
}
elseif (isset($_POST['save']) and !empty($_POST['save']) and isset($_POST['mdtext']) and !empty($_POST['mdtext'])) {
  $file = MDDIR.$_POST['save'];
  file_put_contents ($file,$_POST['mdtext']);
  echo "Сохранено.";
}
elseif (isset($_POST['publish']) and !empty($_POST['publish']) and isset($_POST['html']) and !empty($_POST['html'])) {
  $file = HTMLDIR.$_POST['publish'];
  file_put_contents ($file,$_POST['html']);
  echo "Опубликовано.";
}
else {
  /* error */
  echo "Ошибка\n";
  var_dump($_POST);
}

?>
