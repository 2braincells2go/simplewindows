<?php

$order = $_REQUEST['order'];
$param = $_REQUEST['param'];

if($order == 'sql'){
require_once('mysql_db.php');
$db = Database::getInstance();
$db->connect();
	$css = '<style type = "text/css">#tbl{width: 100%;background: beige;border-collapse: separate;border-spacing: 2px;}';
	$css.= '#tbl th{padding:3px;background-color:steelblue;font-weight:bold;white-space: nowrap;}#tbl td{white-space: nowrap;background-color:white}</style>';
	$sql = "SELECT * FROM yourtable WHERE id > (SELECT MAX(id) FROM counter) - $param ORDER BY date ASC";
	$table = $db-> getHTMLtable($sql, 'tbl');
	echo $css.$table;
$db->disconnect();
}else if($order == 'note_write' && $param){
		$name = 'note.txt';
		$fh = fopen($name, 'w') or die("can't open file");
		fwrite($fh, $param);
		fclose($fh);	
}else if($order == 'note_read'){
	$name = 'note.txt';
	$fh = file_get_contents($name);
	echo $fh;
}
?>
