<?php
header('Content-type: application/json');
$data = array();
$data['myFirstLED'] = array( 'value' => '0' );
$data['mySwitch'] = array( 'value' => 'off' );
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$_POST = json_decode(file_get_contents('php://input'), true);
	if ( $_POST['value'] == 'on' ) {
		$data['myFirstLED'] = array( 'value' => '1' );
		$data['mySwitch'] = array( 'value' => 'on' );
	} 
}
		
echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>