<?php 
$p = array();
$p[] = array( 'name'=>'Red '. $_GET['f07'] );
$p[] = array( 'name'=>'Green '. $_GET['f07'] );
$p[] = array( 'name'=>'Blue '. $_GET['f07'] );
header('Content-type: application/json');
echo json_encode( $p , JSON_PRETTY_PRINT );
?>