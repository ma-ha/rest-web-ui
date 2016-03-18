<?php
session_start();

$portal_id  = -1;
if ( ! isset( $_SESSION["portal_id"] ) ) {
	// define a start config for this session
	$_SESSION['tbl-demo-config'] = '{			
		"filter": {
			"title":"Product Filter",
			"dataReqParams": [ {"id":"collor", "label":"Product Color"} ],
			"dataReqParamsSrc":"Form", 	
			"dataReqParamsBt":"Filter"
		},	
		"rowId": "ID",
		"divs" : [
			{ "id":"ID", "label":"", "cellType":"text" }, 
			{ "id":"Name", "label":"Name", "cellType":"text" }, 
			{ "id":"Picture", "label":"Picture", "cellType":"img" },
			{ "id":"ZoomImg", "cellType":"largeimg", "forImg":"Picture" },
			{ "id":"Status", "label":"Status", "cellType":"checkbox" },
			{ "id":"Rating", "label":"Rating", "cellType":"rating", "ratingType":"3star" },
			{ "id":"Description", "label":"Description", "cellType":"text","editable":"true" },
			{ "id":"ProductPage", "label":"Product Page", "cellType":"linkLink" }
		],
		"maxRows":"4"
	}';
}
header('Content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	
	echo $_SESSION['tbl-demo-config'];
	
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	// Warning: This simplified example is highly insecure!
	// Don't do that lazy coding in production environment! 
	// Always parse the POST body!
	$entityBody = file_get_contents('php://input');
	$_SESSION['tbl-demo-config'] = $entityBody; 
	echo $_SESSION['tbl-demo-config'];
}
?>
	