<?php
session_start();

$portal_id  = -1;
if ( ! isset( $_SESSION["tbl-demo-config"] ) ) {					// define a start config for this session
	
	$_SESSION['tbl-demo-config'] = 
		'{			
			"rowId": "ID",
			"dataURL":"",
			"cols" : [
				{ "id":"ID", "label":"", "cellType":"text" }, 
				{ "id":"Name", "label":"Name", "cellType":"text" }, 
				{ "id":"Picture", "label":"Picture", "cellType":"img" },
				{ "id":"ZoomImg", "cellType":"largeimg", "forImg":"Picture" },
				{ "id":"Status", "label":"Status", "cellType":"checkbox" },
				{ "id":"Rating", "label":"Rating", "cellType":"rating", "ratingType":"3star" },
				{ "id":"Description", "label":"Description", "cellType":"text","editable":"true" },
				{ "id":"Date", "label":"Created", "cellType":"date" },
				{ "id":"ProductPage", "label":"Product Page", "cellType":"linkLink" }
			],
			"maxRows":"4"
		}';
}

header('Content-type: application/json');
if ( $_SERVER['REQUEST_METHOD'] === 'GET' ) {					// load the config
	
	echo $_SESSION['tbl-demo-config'];
	
} else if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {			// replace the config with POST body
	
	// WARNING: Don't do that lazy coding in production environment! You must always parse the POST body!
	$entityBody = file_get_contents('php://input');
	error_log( $entityBody );
	$_SESSION['tbl-demo-config'] = $entityBody; 
	echo $_SESSION['tbl-demo-config'];
	
} else if ( $_SERVER['REQUEST_METHOD'] === 'DELETE' ) { 		// reset the config (with next GET request)

	unset( $_SERVER['tbl-demo-config'] );
	
}
?>
	