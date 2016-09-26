<?php 
$p = array();
$p[] = array( 'id'=>'101', 'item'=>'Red Shoes', 'type'=>'23', 'price'=>'199.99' );
$p[] = array( 'id'=>'102', 'item'=>'Black Shoes', 'type'=>'23', 'price'=>'179,00' );
$p[] = array( 'id'=>'103', 'item'=>'Green Shoes', 'type'=>'23', 'price'=>'139,99' );
$p[] = array( 'id'=>'104', 'item'=>'Grey Shoes', 'type'=>'241', 'price'=>'145,00' );
$p[] = array( 'id'=>'105', 'item'=>'White Shoes', 'type'=>'241', 'price'=>'120,00' );
$p[] = array( 'id'=>'106', 'item'=>'Yellow Shoes', 'type'=>'242', 'price'=>'139,00' );
$p[] = array( 'id'=>'107', 'item'=>'Pink Shoes', 'type'=>'243', 'price'=>'219,99' );
$p[] = array( 'id'=>'108', 'item'=>'Blue Shoes', 'type'=>'25', 'price'=>'111,11' );
$p[] = array( 'id'=>'109', 'item'=>'Nice Shoes', 'type'=>'25', 'price'=>'144,44' );
$p[] = array( 'id'=>'111', 'item'=>'Red Handbag', 'type'=>'1', 'price'=>'120,00' );
$p[] = array( 'id'=>'112', 'item'=>'Black Handbag', 'type'=>'1', 'price'=>'110,00' );
$p[] = array( 'id'=>'113', 'item'=>'Green Handbag', 'type'=>'1', 'price'=>'230,00' );
$p[] = array( 'id'=>'101', 'item'=>'Ping Shoes', 'type'=>'23', 'price'=>'199.99' );
$p[] = array( 'id'=>'102', 'item'=>'Black Handbag', 'type'=>'23', 'price'=>'179,00' );
$p[] = array( 'id'=>'103', 'item'=>'Green Handbag', 'type'=>'23', 'price'=>'139,99' );
$p[] = array( 'id'=>'104', 'item'=>'Grey Handbag', 'type'=>'241', 'price'=>'145,00' );
$p[] = array( 'id'=>'105', 'item'=>'White Handbag', 'type'=>'241', 'price'=>'120,00' );
$p[] = array( 'id'=>'106', 'item'=>'Yellow Handbag', 'type'=>'242', 'price'=>'139,00' );
$p[] = array( 'id'=>'107', 'item'=>'Pink Shoes', 'type'=>'243', 'price'=>'219,99' );
$p[] = array( 'id'=>'108', 'item'=>'Blue Shoes', 'type'=>'25', 'price'=>'111,11' );
$p[] = array( 'id'=>'109', 'item'=>'Nice Shoes', 'type'=>'25', 'price'=>'144,44' );
$p[] = array( 'id'=>'111', 'item'=>'Red Handbag', 'type'=>'1', 'price'=>'120,00' );
$p[] = array( 'id'=>'112', 'item'=>'Black Handbag', 'type'=>'1', 'price'=>'110,00' );
$p[] = array( 'id'=>'113', 'item'=>'Green Handbag', 'type'=>'1', 'price'=>'230,00' );
header('Content-type: application/json');
if ( $_SERVER['REQUEST_METHOD'] === 'GET' ) {		
	if ( isset( $_GET['productId'] ) ) {
		$id = $_GET['productId'];
		$r = array();
		foreach ( $p as $rec ) {
			if ( substr( $rec['type'], 0, strlen($id) ) === $id ) {
				$r[] = $rec;
			}
		}
		echo json_encode( $r , JSON_PRETTY_PRINT );
	} else if ( isset( $_GET['productName'] ) ) {
		$id = $_GET['productName'];
		$r = array();
		foreach ( $p as $rec ) {
			if ( strpos( $rec['item'], $id ) !== false ) {
				$r[] = $rec;
			}
		}
		echo json_encode( $r , JSON_PRETTY_PRINT );
	} else if ( isset( $_GET['minPrice'] ) && isset( $_GET['maxPrice'] ) ) {
		$min = floatval( $_GET['minPrice'] );
		$max = floatval( $_GET['maxPrice'] );
		$r = array();
		foreach ( $p as $rec ) {
			if ( $min < floatval( $rec['price'] )   && floatval( $rec['price'] ) <= $max ) {
				$r[] = $rec;
			}
		}
		if ( count( $r ) == 0 )
			echo "[]";
		else
			echo json_encode( $r , JSON_PRETTY_PRINT );
	} else {
		echo json_encode( $p , JSON_PRETTY_PRINT );
	}
}
?>