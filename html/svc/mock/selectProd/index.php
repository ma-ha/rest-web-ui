<?php 
$p = array();
if ( $_GET['cat'] != '' ) {
  $p[] = array( 'name'=>'' );
  $p[] = array( 'name'=>'Red '. $_GET['cat'] );
  $p[] = array( 'name'=>'Green '. $_GET['cat'] );
  $p[] = array( 'name'=>'Blue '. $_GET['cat'] );
  $p[] = array( 'name'=>'Pink '. $_GET['cat'] );
}
header('Content-type: application/json');
echo json_encode( $p , JSON_PRETTY_PRINT );
?>