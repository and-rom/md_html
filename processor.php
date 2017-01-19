<?php
error_reporting(0);

require_once 'Michelf/MarkdownExtra.inc.php';

if (file_exists($_SERVER['DOCUMENT_ROOT'] . "./config.php")) include($_SERVER['DOCUMENT_ROOT'] . "/config.php");

if (!defined("MDDIR")) define ("MDDIR", "./md/");
if (!defined("HTMLDIR")) define ("HTMLDIR", "./html/");

$obj = new stdClass;

function _dir() {
  global $obj;

  if (is_dir(MDDIR)) {
    $list = scandir(MDDIR);
    unset($list[0]);unset($list[1]);
    if (sizeof($list) > 0) {
      $obj->status = "ok";
      $obj->result = array_values($list);
    } else {
      $obj->status = "error";
      $obj->error_msg = "No files.";
    }
  } else {
    $obj->status = "error";
    $obj->error_msg = "No md dir.";
  }
}

function _open($filename) {
  global $obj;

  $file = MDDIR.$filename;
  if (!empty($filename) and file_exists($file) and is_file($file)) {
    if ($obj->result = file_get_contents($file)) {
      $obj->status = "ok";
    } else {
      $obj->status = "error";
      $obj->error_msg = "Error on file read.";
    }
  } else {
    $obj->status = "error";
    $obj->error_msg = "File not exist.";
  }
}

function _save($filename,$md) {
  global $obj;

  if (!empty($md)) {
    if (!empty($filename)) {
      $file = MDDIR.$filename;
      if (file_put_contents ($file,$md)) {
        $obj->status = "ok";
      } else {
        $obj->status = "error";
        $obj->error_msg = "Error on file write.";
      }
    } else {
      $obj->status = "error";
      $obj->error_msg = "File name empty.";
    }
  } else {
    $obj->status = "error";
    $obj->error_msg = "Empty md.";
  }
}

function _publish($filename,$md) {
  //$Instance = new ParsedownExtra();
  //$contents = $Instance->text($_POST['mdtext']);
  //$file = HTMLDIR.$_POST['publish'];
  //file_put_contents ($file,$contents);
  global $obj;

  if (!empty($md)) {
    if (!empty($filename)) {
      $file = HTMLDIR.$filename;
      $html = \Michelf\MarkdownExtra::defaultTransform($md);
      if (file_put_contents ($file,$html)) {
        $obj->status = "ok";
      } else {
        $obj->status = "error";
        $obj->error_msg = "Error on file write.";
      }
    } else {
      $obj->status = "error";
      $obj->error_msg = "File name empty.";
    }
  } else {
    $obj->status = "error";
    $obj->error_msg = "Empty md.";
  }
}

function _parse($md) {
  global $obj;

  if (!empty ($md)) {
    $obj->status = "ok";
    $obj->result = \Michelf\MarkdownExtra::defaultTransform($md);
  } else {
    $obj->status = "error";
    $obj->error_msg = "Empty md.";
  }
}



if (!empty($_POST)){
  $action = (isset($_POST["action"]) ? $_POST["action"] : "");
    switch ($action) {
      case "dir":
        _dir();
        break;
      case "open":
        _open(isset($_POST["filename"]) ? $_POST["filename"] : "");
        break;
      case "save":
        _save((isset($_POST["filename"]) ? $_POST["filename"] : ""),isset($_POST["md"]) ? $_POST["md"] : "");
        break;
      case "publish":
        _publish((isset($_POST["filename"]) ? $_POST["filename"] : ""),isset($_POST["md"]) ? $_POST["md"] : "");
        break;
      case "parse":
        _parse(isset($_POST["md"]) ? $_POST["md"] : "");
        break;
      default:
        $obj->status = "error";
        $obj->error_msg = "Wrong action.";
        break;
    }
} else {
  $obj->status = "error";
  $obj->error_msg = "Empty request";
}

  header('Content-Type: application/json');
  echo json_encode($obj,JSON_UNESCAPED_UNICODE);
?>
