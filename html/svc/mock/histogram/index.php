<?php 
$p = array();
$p[] = array( 'price'=>'0-10€', 'count'=>'0' );
$p[] = array( 'price'=>'20€', 'count'=>'2' );
$p[] = array( 'price'=>'30€', 'count'=>'10' );
$p[] = array( 'price'=>'40€', 'count'=>'20' );
$p[] = array( 'price'=>'50€', 'count'=>'10' );
$p[] = array( 'price'=>'60€', 'count'=>'5' );
$p[] = array( 'price'=>'80€', 'count'=>'2' );
$p[] = array( 'price'=>'70€', 'count'=>'2' );
$p[] = array( 'price'=>'90€', 'count'=>'30' );
$p[] = array( 'price'=>'100€', 'count'=>'50' );
$p[] = array( 'price'=>'110€', 'count'=>'0' );
$p[] = array( 'price'=>'120€', 'count'=>'4' );
$p[] = array( 'price'=>'130€', 'count'=>'5' );
$p[] = array( 'price'=>'140€', 'count'=>'6' );
$p[] = array( 'price'=>'150€', 'count'=>'10' );
$p[] = array( 'price'=>'160€', 'count'=>'4' );
$p[] = array( 'price'=>'170€', 'count'=>'3' );
$p[] = array( 'price'=>'180€', 'count'=>'2' );
$p[] = array( 'price'=>'190€', 'count'=>'5' );
$p[] = array( 'price'=>'200€', 'count'=>'5' );
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
	} else {
		echo json_encode( $p , JSON_PRETTY_PRINT );
	}
}
?>