<?php 
header('Content-type: application/json');
$data = array();
$data["title"] = 'Test';
$data["html"]  = 'Hello World';
$data["width"] = 200;
$data["height"] = 200;
$data["buttonTxt"]  = 'Okey-Dokey';
echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>