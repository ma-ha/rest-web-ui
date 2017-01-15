<?php
header('Content-type: application/json');
$data = array();
$data['myFirstLED'] = array( 'value' => '0' );
$data['mySwitch'] = array( 'value' => 'off' );

$dta =  array();

$t = ( time() - 60*60 ) * 1000; 

for ( $i=0; $i<60; $i++ ) {
	$val = array();
	$val[0] = $t;
	$t += 60000;
	$val[1] = $i/11;
	$dta[] = $val;
}

$data['voltage'] = 
	array(
		array( 'name' => 'AD0', 'data' => $dta ),
	);
$data['voltageLog'] = $data['voltage'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$_POST = json_decode(file_get_contents('php://input'), true);
	if ( $_POST['value'] == 'on' ) {
		$data['myFirstLED'] = array( 'value' => '1' );
		$data['mySwitch'] = array( 'value' => 'on' );
	} 
}
		
echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>