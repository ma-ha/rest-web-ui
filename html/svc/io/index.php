<?php 
header('Content-type: application/json');
$data = array();
$data['switchMain'] = array( 'value' => 'Power ON' );
$data['ledValveN2']   = array( 'value' => '0' );
$data['ledValveTMP']  = array( 'value' => '-1' );
$data['ledValveChHi'] = array( 'value' => '-1' );
$data['ledValveChLo'] = array( 'value' => '-1' );
$data['ledTMP'] = array( 'value' => '-1' );
$data['ledRP'] = array( 'value' => '1' );
$data['displayG1'] = array( 'value' => '100 kPa' );
$data['displayG2'] = array( 'value' => 'Hi' );
$data['switchRP'] = array( 'value' => 'OFF' );
$data['switchTMP'] = array( 'value' => 'OFF' );
$data['switchValveN2'] = array( 'value' => 'close' );
$data['switchValveTMP'] = array( 'value' => 'close' );
$data['switchValveChHi'] = array( 'value' => 'close' );
$data['switchValveChLo'] = array( 'value' => 'close' );
$data['switchValveN2n'] = array( 'value' => '0' );
$data['switchValveInflate'] = array( 'value' => '100' );
echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>