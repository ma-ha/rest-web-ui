<?php 
header('Content-type: application/json');
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	$_POST = json_decode(file_get_contents('php://input'), true);
	if ( $_POST['value'] == 'Power OFF' ) {
		unset( $_SESSION["p1"] );
	}
	if ( $_POST['value'] == 'Power ON' ) {
		$_SESSION["switchMain"] = 'Power ON';
	}
}

// append values to T and P graph
$tVal[0] = $_SESSION['graphTx']; 
$tVal[1] = 20;
$_SESSION['graphT'][] = $tVal;

$pVal[0] = $_SESSION['graphTx'];
$pVal[1] = $_SESSION["p1"];
$_SESSION['graphP1'][] = $pVal;

$pVal[1] = $_SESSION["p2"];
$_SESSION['graphP2'][] = $pVal;

$pVal[1] = $_SESSION["p3"];
$_SESSION['graphP3'][] = $pVal;

$_SESSION['graphTx'] = $_SESSION['graphTx'] + 1;

// error_log( " graphP1 ". count( $_SESSION['graphP1'] ) );
// error_log( " graphP2 ". count( $_SESSION['graphP2'] ) );
if (  count( $_SESSION['graphP1'] ) > 100 ) {
	$_SESSION['graphP1'] = array_slice( $_SESSION['graphP1'] , count( $_SESSION['graphP1'] ) - 100 );
}
if (  count( $_SESSION['graphP2'] ) > 100 ) {
	$_SESSION['graphP2'] = array_slice( $_SESSION['graphP2'] , count( $_SESSION['graphP2'] ) - 100 );
}
if (  count( $_SESSION['graphT'] ) > 100 ) {
	$_SESSION['graphT']  = array_slice( $_SESSION['graphT']  , count( $_SESSION['graphT'] )  - 100 );
}

$tVal = array();
if ( ! isset( $_SESSION["p1"] ) ) {	
	$_SESSION['graphT'] = array();
	$_SESSION['graphTx'] = 0;
	
	error_log( $_SESSION['graphTx'] );
	$tVal[0] = $_SESSION['graphTx']; $_SESSION['graphTx'] = $_SESSION['graphTx'] +1;
	$tVal[1] = 20;
	$_SESSION['graphT'][] = $tVal;
	error_log( $_SESSION['graphTx'] );
	$tVal[0] = $_SESSION['graphTx']; $_SESSION['graphTx'] = $_SESSION['graphTx'] +1;
	$_SESSION['graphT'][] = $tVal;
		error_log( $_SESSION['graphTx'] );
	$tVal[0] = $_SESSION['graphTx']; $_SESSION['graphTx'] = $_SESSION['graphTx'] +1;
	$_SESSION['graphT'][] = $tVal;
		error_log( $_SESSION['graphTx'] );
	$tVal[0] = $_SESSION['graphTx']; $_SESSION['graphTx'] = $_SESSION['graphTx'] +1;
	$_SESSION['graphT'][] = $tVal;
	error_log( $_SESSION['graphTx'] );
	
	$_SESSION["p1t"] = 100;
	$_SESSION["p2t"] = 100;
	$_SESSION["p3t"] = 100;
	
	$_SESSION["p1"] = 100;
	$_SESSION["p2"] = 100;
	$_SESSION["p3"] = 100;
	
	$_SESSION["switchMain"] = 'Power ON';
	$_SESSION["buttonTMP"]  = 'OFF';
	$_SESSION["ledTMP"]     = '-1';
	$_SESSION["TMP"]     = '-';
	$_SESSION["buttonRP"]   = 'OFF';
	$_SESSION["ledRP"]      = '-1';
	$_SESSION["switchValveInflate"] = 100;
	$_SESSION["switchValveN2n"] = 0;
	
	$_SESSION["switchValveN2"]   = 'close';
	$_SESSION["switchValveTMP"]  = 'close';
	$_SESSION["switchValveChHi"] = 'inflate';
	
	$_SESSION["ledValveN2"] = '-1';
	$_SESSION["ledValveTMP"] = '-1';
	$_SESSION["ledValveChHi"] = '-1';
	$_SESSION["ledValveChLo"] = '-1';
	
	$_SESSION['graphP1'] = array();
	$pVal[0] = $_SESSION['graphTx']; 
	$pVal[1] = $_SESSION["p1"];
	$_SESSION['graphP1'][] = $pVal;

	$_SESSION['graphP2'] = array();
	$pVal[0] = $_SESSION['graphTx']; 
	$pVal[1] = $_SESSION["p2"];
	$_SESSION['graphP2'][] = $pVal;

	$_SESSION['graphP3'] = array();
	$pVal[0] = $_SESSION['graphTx']; 
	$pVal[1] = $_SESSION["p3"];
	$_SESSION['graphP3'][] = $pVal;
}


if ( $_SERVER['REQUEST_METHOD'] === 'POST' && 	$_SESSION["switchMain"] != 'Power OFF' ) {

	error_log( $_POST['id'] .'='. $_POST['value'] );
	if ( $_POST['type'] == "Button" ) {
		if ( $_SESSION[ $_POST['id'] ] == 'OFF') {
			$_SESSION[ $_POST['id'] ]  = 'ON';
		} else {
			$_SESSION[ $_POST['id'] ]  = 'OFF';
		}
	} else {
		$_SESSION[ $_POST['id'] ] = $_POST['value'];
	}

	if ( $_POST['id'] == 'buttonTMP' ) {
		if ( $_POST['value'] == 'ON' ) {
			$_SESSION["ledTMP"] = '2';
		} else {
			$_SESSION["ledTMP"] = '2';
		}
	}
	if ( $_POST['id'] == 'buttonRP' ) {
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
	if ( $_SESSION["buttonTMP"]  == 'OFF') { // Power down done
		$_SESSION["ledTMP"] = '-1';
	} else {
		if ( $_SESSION["buttonRP"]  == 'ON' && $_SESSION["switchValveTMP"] == 'open') { // Power up done if PR is ON
			$_SESSION["ledTMP"] = '1';
		}
	}
}
if ( $_SESSION["ledTMP"]  == '1') {
	$_SESSION["p1t"] = 0.1;
// 	error_log( "p1 = 2" );
} else {
	if ( $_SESSION["ledValveTMP"] == '1' && $_SESSION["buttonRP"] == 'ON') {
		$_SESSION["p1t"] = $_SESSION["p3"];
// 		error_log( "p1 = 10" );
	}
}
if ( $_SESSION["ledValveChHi"] == '1' ) {
	$_SESSION["p1"] =  $_SESSION["p1"] + ( $_SESSION["p2"] - $_SESSION["p1"] ) / 10; 
	$_SESSION["p2t"] = $_SESSION["p1"];
}
if ( $_SESSION["buttonRP"] == 'ON') { 
	$_SESSION["p3t"] = 10;
	if ( $_SESSION["switchValveInflate"] < 10) {
		if ( $_SESSION["ledValveChLo"] == '1' ) {
			$_SESSION["p3"] =  $_SESSION["p2"] + ( $_SESSION["p3"] - $_SESSION["p2"] ) / 10; 
			$_SESSION["p2t"] = $_SESSION["p3"];
		} 
		if ( $_SESSION["ledValveChHi"] == '1' ) {
			$_SESSION["p1"] =  $_SESSION["p1"] + ( $_SESSION["p2"] - $_SESSION["p1"] ) / 10; 
			$_SESSION["p2t"] = $_SESSION["p1"];
		} 
	} else {
		if ( $_SESSION["ledValveChLo"] == '1' ) {
			$_SESSION["p2t"] = 80;
		} else if ( $_SESSION["ledValveChHi"] == '1' ) {
			$_SESSION["p1"] =  $_SESSION["p1"] + ( $_SESSION["p2"] - $_SESSION["p1"] ) / 10; 
			$_SESSION["p2t"] = $_SESSION["p1"];
		} else {
			$_SESSION["p2t"] = 100;
		}
	}
} else {
	$_SESSION["p3t"] = 100;
}

$_SESSION["p1"] += ( $_SESSION["p1t"] - $_SESSION["p1"] ) / 2; 
$_SESSION["p2"] += ( $_SESSION["p2t"] - $_SESSION["p2"] ) / 2;
$_SESSION["p3"] += ( $_SESSION["p3t"] - $_SESSION["p3"] ) / 2;
$p1 = round( $_SESSION["p1"] , 2 );
$p2 = round( $_SESSION["p2"] , 2 );
$p3 = round( $_SESSION["p3"] , 2 );

$data = array();
$data['mainLED'] = array( 'value' => 'OK' );
$data['switchMain'] = array( 'value' => $_SESSION["switchMain"] );
$data['ledValveN2']   = array( 'value' => $_SESSION["ledValveN2"] );
$data['ledValveTMP']  = array( 'value' => $_SESSION["ledValveTMP"] );
$data['ledValveChHi'] = array( 'value' => $_SESSION["ledValveChHi"] );
$data['ledValveChLo'] = array( 'value' => $_SESSION["ledValveChLo"] );
$data['ledTMP'] = array( 'value' => $_SESSION["ledTMP"] );
$data['ledRP'] = array( 'value' => $_SESSION["ledRP"] );
$data['displayG1'] = array( 'value' => $p1.' kPa' );
$data['displayG2'] = array( 'value' => $p2.' kPa' );
$data['displayG3'] = array( 'value' => $p3.' kPa' );
$data['buttonRP']  = array( 'value' => $_SESSION["buttonRP"] );
$data['buttonTMP'] = array( 'value' => $_SESSION["buttonTMP"] );
$data['switchValveN2']   = array( 'value' => $_SESSION["switchValveN2"]  );
$data['switchValveTMP']  = array( 'value' => $_SESSION["switchValveTMP"]  );
$data['switchValveChHi'] = array( 'value' => $_SESSION["switchValveChHi"]  );
$data['switchValveN2n']     = array( 'value' => $_SESSION["switchValveN2n"] );
$data['switchValveInflate'] = array( 'value' => $_SESSION["switchValveInflate"] );
$data['graphT'] = array( array( 'name' => 'chamber', 'data' => $_SESSION["graphT"] ) );
$data['graphP'] = 
	array( 
		array( 'name' => 'pump', 'data' => $_SESSION["graphP1"] ), 
		array( 'name' => 'chamber', 'data' => $_SESSION["graphP2"] ), 
		array( 'name' => 'prevac', 'data' => $_SESSION["graphP3"] ) 
	);

echo json_encode( $data , JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES  );
?>