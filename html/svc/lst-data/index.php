<?php
header('Content-type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	echo json_encode( array() );
} else {
	echo 
		'[{"ID":"ABC","CustomerCount":"1234","Rating":"3","Status":"false","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-e","L":"30%","Ltrend":"arrow-1-ne"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-n","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>","Picture":"img/x02.png","ZoomImg":"img/tst.jpg"},'
        .'{"ID":"XYZ","CustomerCount":"345","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-se","L":"30%","Ltrend":"arrow-1-ne"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:orange\">99,96%</span>","Picture":"img/x03.png","ZoomImg":"img/tst.jpg"},'
        .'{"ID":"A123","CustomerCount":"678","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-se","M":"30%","Mtrend":"arrow-1-n","L":"30%","Ltrend":"arrow-1-e"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-s","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:green\">100%</span>","Picture":"img/x04.png","ZoomImg":"img/tst.jpg"},'
        .'{"ID":"YIII","CustomerCount":"900","Rating":"2","Status":"true","Size":{"S":"40%","Strend":"arrow-1-e","M":"30%","Mtrend":"arrow-1-n","L":"30%","Ltrend":"arrow-1-se"},"Orders":{"D":"4","W":"11","M":"123","Dtrend":"arrow-1-ne","Wtrend":"arrow-1-e","Mtrend":"arrow-1-se"},"Availability":"<span style=\"color:red\">88,5%</span>","Picture":"img/x05.png","ZoomImg":"img/tst.jpg"}]';
}
?>

