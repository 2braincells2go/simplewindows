<!doctype html>
<html>
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title></title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/simplewindows.1.0.0.min.css">
    <link type ="text/css" rel="stylesheet" href="css/codemirror.css" charset="utf-8" media="all">  
    <link type ="text/css" rel="stylesheet" href="css/monokai.css" charset="utf-8" media="all">   
    <script type = "text/javascript" src="js/jquery-1.9.0.1.min.js"></script>
    <script type = "text/javascript" src="js/simplewindows.1.0.0.min.js"></script>
    <script src="js/codemirror.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/clike.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/xml.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/javascript.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/htmlmixed.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/php.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/script.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
    <div class="wrapper" >
        <div class = "header">
            <h1>simpleWindows Demonstration</h1>
            <p style ="margin-left: 5px;font-weight: bold;float: left;">Arrange of windows: press alt + c key combination.</p><br>
            <p style ="margin-left: 5px;font-weight: bold;float: left;">Restore, Down: double click on the window header.</p>
            <a href = "https://github.com/andrastoth/simplewindows" type = "button" class = "button"  onclick = "window.open(this.href, '_top');">Download from Github</a>
            <input type = "button" value = "Documentation" class = "button" name = "viewDoc" >
            <input type = "button" value = "Get random Window" class = "button" name = "getWin" onclick = "randomed()">
        </div>
        <div class = "container">
            <div class = "one"><iframe src = "http://atandrastoth.co.uk/advtable/" style = "width:100%;height:100%" frameborder = "0"></iframe></div> 
            <div class = "two"></div>
            <div class = "three"></div>       
        </div>
    </div>
    <div class = "overlay"></div>
    <div class = "documentWrapper">
        <div class = "docHeader">
            <img src = "css/close_button.png" class = "close">
            <h1>Documentation</h1>
        </div>
        <div class = "docBody">
            <p>Required minimal HTML code:</p>
            <textarea name="htmlCode">
&lt;html&gt;
&lt;head&gt;
    &lt;meta charset="utf-8"/&gt;
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"&gt;
    &lt;title&gt;&lt;/title&gt;
    &lt;link rel="stylesheet" href="css/simplewindows.css"&gt;
    &lt;script type = "text/javascript" src="js/jquery-1.9.0.1.min.js"&gt;&lt;/script&gt;
    &lt;script type = "text/javascript" src="js/simplewindows.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div id = "win"&gt;&lt;/div&gt;
    &lt;script type="text/javascript" &gt;
$(document).ready(function(){
    $('#win').simpleWindows();
})
    &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;   
            </textarea>
            <p>Parameters and defaults:</p>
            <textarea name="params">
simWinGlobal                                                                     // Global variable
simWinGlobal.active                                                              // Active window object
simWinGlobal.winBody                                                             // Active window body
simWinGlobal.Parent                                                              // Active window parent element  

defaults = {
    source: $('&lt;textarea style =  "width:100%;height:100%;"&gt&lt/textarea&gt;'),       // jQuery HTML  - object 
    headerText: 'New Window',                                                    // Window Name  - string 
    funcKey: 'altKey',                                                           // Function key recomended this - string
    arrangeKey: 'c',                                                             // key to arrange - char
    keys: {},                                                                    // more user defined key, php and action config see below   
    dimension: {                                                                 // Window dimension all integer
    top: 20,
    left: 20,
    width: 800,
    height: 300,
    }
}

// inportant: first source is your object innerobject, 
//if empty then your option selected source, if this option not defined then default textarea
// Example for Ajax and user key config:

   $('#win').simpleWindows({
       source: $('&lt;textarea style =  "width:100%;height:100%;"&gt&lt/textarea&gt;''),
       headerText: 'New Windows',
       funcKey: 'altKey',
       arrangeKey: 'c',
       keys: {
           loadKey: {                                                   // name:
               key: 'r',                                                // key to activate - char
               order: 'sql',                                            // parameter for php file
               param: 100,                                              // parameter for php file
               phpFile: 'com.php',                                      // php file name
               resFunction: function() {
                   var retVal = simWinGlobal.active.simpleWindows.ajaxCall(this.phpFile, this.order, this.param);  
                   // Ajax call with this parameter to active window
                   simWinGlobal.winBody.html('&lt;div style = "width:100%;height:100%;overflow:auto"&gt;' + retVal + '</div>');  
                   // set the result to active window
               }
           },
           backroundKey: {                                              // name:
               key: 'b',                                                // key to activate - char
               order: false,                                            // set false if not used
               param: false,                                            // set false if not used
               phpFile: false,                                          // set false if not used
               resFunction: function() {
                    simWinGlobal.active.css('background-color','red');  // change active window background color 
                    simWinGlobal.winBody.html('');                      // active window body clear or add another html  
               }
           },
           ... : {}                                                     //more key and config 
       },
       dimension: {
           top: 80,
           left: 80,
           width: 800,
           height: 300,
       }
   });
            </textarea>  
            <p>Example PHP file:</p>
            <textarea name="php">
&lt;?php
require_once('mysql_db.php');
$db = Database::getInstance();
$db->connect();
$order = $_REQUEST['order'];
$param = $_REQUEST['param'];

if($order == 'sql'){
  $css = '<style type = "text/css">#tbl{width: 100%;background: beige;border-collapse: separate;border-spacing: 2px;}';
  $css.= '#tbl th{padding:3px;background-color:steelblue;font-weight:bold;white-space: nowrap;}';
  $css.= '#tbl td{white-space: nowrap;background-color:white}</style>';
  $sql = "SELECT * FROM yourtable WHERE yourfield = $param ";
  $table = $db-> getHTMLtable($sql, 'tbl');
  echo $css.$table;
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

$db->disconnect();
?&gt;
            </textarea>
        </div>
    </div>
</body>
</html>