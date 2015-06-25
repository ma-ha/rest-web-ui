<?php
$lang = "EN";
if ( isset( $_GET['lang'] ) ) {	$lang = $_GET['lang']; }

if ( $lang == "DE" ) { 
?>
<p>Dummy Hilfe</p>
<?php
} else {
?>
<p>Dummy help</p>
<?php
}
