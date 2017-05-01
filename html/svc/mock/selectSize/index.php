<?php 
$p = array();
if ( $_GET['prod'] != '' ) {
  $p[] = array( 'name'=> $_GET['prod'].' S' );
  $p[] = array( 'name'=> $_GET['prod'].' M' );
  $p[] = array( 'name'=> $_GET['prod'].' L' );
}
header('Content-type: application/json');
echo json_encode( $p , JSON_PRETTY_PRINT );
?>