<?php 
header('Content-type: application/json');
session_start();
if ( ! isset( $_SESSION["p1"] ) ) {
	$_SESSION["p1"] = 100;
	$_SESSION["p2"] = 100;
	$_SESSION["switchMain"] = 'Power ON';
	$_SESSION["switchTMP"]  = 'OFF';
	$_SESSION["ledTMP"]     = '-1';
	$_SESSION["TMP"]     = '-';
	$_SESSION["switchRP"]   = 'OFF';
	$_SESSION["ledRP"]      = '-1';
	$_SESSION["switchValveInflate"] = 100;
	$_SESSION["switchValveN2n"] = 0;
	
	$_SESSION["switchValveN2"]   = 'close';
	$_SESSION["switchValveTMP"]  = 'close';
	$_SESSION["switchValveChHi"] = 'close';
	$_SESSION["switchValveChLo"] = 'close';
	
	$_SESSION["ledValveN2"] = '-1';
	$_SESSION["ledValveTMP"] = '-1';
	$_SESSION["ledValveChHi"] = '-1';
	$_SESSION["ledValveChLo"] = '-1';
	
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

	error_log( $_POST['id'] .'='. $_POST['value'] );
	$_SESSION[ $_POST['id'] ] = $_POST['value'];

	if ( $_POST['id'] == 'switchTMP' ) {
		if ( $_POST['value'] == 'ON' ) {
			$_SESSION["ledTMP"] = '2';
		} else {
			$_SESSION["ledTMP"] = '2';
		}
	}
	if ( $_POST['id'] == 'switchRP' ) {
		if ( $_POST['value'] == 'ON' ) {
			$_SESSION["ledRP"] = '1';
		} else {
			$_SESSION["ledRP"] = '-1';
		}
	}
	if ( $_POST['id'] == 'switchValveN2' ) {
		if ( $_POST['value'] == 'close' ) {
			$_SESSION["ledValveN2"] = '-1';
		} else {
			$_SESSION["ledValveN2"] = '1';
		}
	}
	if ( $_POST['id'] == 'switchValveTMP' ) {
		if ( $_POST['value'] == 'close' ) {
			$_SESSION["ledValveTMP"] = '-1';
		} else {
			$_SESSION["ledValveTMP"] = '1';
		}
	}
	if ( $_POST['id'] == 'switchValveChHi' ) {
		if ( $_POST['value'] == 'V3' ) {
			$_SESSION["ledValveChHi"] = '-1';
			$_SESSION["ledValveChLo"] = '1';
		} else if ( $_POST['value'] == 'V4' ) {
			if ( $_SESSION["switchValveInflate"] < 10) {
				$_SESSION["ledValveChLo"] = '-1';
				$_SESSION["ledValveChHi"] = '1';
			} else {
				$_SESSION["switchValveChHi"] = 'inflate';
			}
		} else {
			$_SESSION["ledValveChLo"] = '-1';
			$_SESSION["ledValveChHi"] = '-1';
		}
	}
}




if ( $_SESSION["ledTMP"] == '2' ) {
	if ( $_SESSION["switchTMP"]  == 'OFF') { // Power down done
		$_SESSION["ledTMP"] = '-1';
	} else {
		if ( $_SESSION["switchRP"]  == 'ON' && $_SESSION["switchValveTMP"] == 'open') { // Power up done if PR is ON
			$_SESSION["ledTMP"] = '1';
		}
	}
}
if ( $_SESSION["ledTMP"]  == '1') {
	$_SESSION["p1"] = 2;
	error_log( "p1 = 2" );
} else {
	if ( $_SESSION["ledValveTMP"] == '1' && $_SESSION["switchRP"] == 'ON') {
		$_SESSION["p1"] = 10;
		error_log( "p1 = 10" );
	} else {
		$_SESSION["p1"] = 100;
		error_log( "p1 = 100" );
	}
}
if ( $_SESSION["ledValveChHi"] == '1' ) {	
	$_SESSION["p2"] = $_SESSION["p1"];
}
if ( $_SESSION["switchRP"] == 'ON') { 
	if ( $_SESSION["switchValveInflate"] < 10) {
		if ( $_SESSION["ledValveChLo"] == '1' ) {
			$_SESSION["p2"] = 10;
		} 
		if ( $_SESSION["ledValveChHi"] == '1' ) {
			$_SESSION["p2"] = $_SESSION["p1"];
		} 
	} else {
		if ( $_SESSION["ledValveChLo"] == '1' ) {
			$_SESSION["p2"] = 80;
		} else if ( $_SESSION["ledValveChHi"] == '1' ) {
			$_SESSION["p2"] = $_SESSION["p1"];
		} else {
			$_SESSION["p2"] = 100;
		}
	}
}


$data = array();
$data['switchMain'] = array( 'value' => $_SESSION["switchMain"] );
$data['ledValveN2']   = array( 'value' => $_SESSION["ledValveN2"] );
$data['ledValveTMP']  = array( 'value' => $_SESSION["ledValveTMP"] );
$data['ledValveChHi'] = array( 'value' => $_SESSION["ledValveChHi"] );
$data['ledValveChLo'] = array( 'value' => $_SESSION["ledValveChLo"] );
$data['ledTMP'] = array( 'value' => $_SESSION["ledTMP"] );
$data['ledRP'] = array( 'value' => $_SESSION["ledRP"] );
$data['displayG1'] = array( 'value' => $_SESSION["p1"].' kPa' );
$data['displayG2'] = array( 'value' => $_SESSION["p2"].' kPa' );
$data['switchRP']  = array( 'value' => $_SESSION["switchRP"] );
$data['switchTMP'] = array( 'value' => $_SESSION["switchTMP"] );
$data['switchValveN2']   = array( 'value' => $_SESSION["switchValveN2"]  );
$data['switchValveTMP']  = array( 'value' => $_SESSION["switchValveTMP"]  );
$data['switchValveChHi'] = array( 'value' => $_SESSION["switchValveChHi"]  );
$data['switchValveChLo'] = array( 'value' => $_SESSION["switchValveChLo"]  );
$data['switchValveN2n']     = array( 'value' => $_SESSION["switchValveN2n"] );
$data['switchValveInflate'] = array( 'value' => $_SESSION["switchValveInflate"] );
echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>