/**
 *
 * This is the main Angular JavaScript module. 
 *
 * It has all the controller source
 *
 */
var DSERegressionTester = angular.module("DSERegressionTester", ['ui.bootstrap', 'sampleSrv']);

var	AppCtrl	=	['$scope',	'dialogServices', 'dataServices',
function AppCtrl($scope,	dialogServices, dataServices)	{
 		
	
	// init UI data model
	$scope.neighborhoods = ["Bloemenbuurt", "Bomenbuurt", "Gein", "Parkbuurt", "Rijkzicht"];
    $scope.bldgtypes = ["2-onder-1 kap", "Appartement", "Hoekwoning", "Tussenwoning", "Vrijstaand"];
	$scope.p = { YEARBUILT: '1998',	NEIGHBORHOOD:'Gein', BLDGTYPE:'Vrijstaand', VOLUMEINT: '666', VOLUMEOTH: '145', LOTSIZE: '441' };	
			   
		
	$scope.score = function()	{
		dataServices.getScore($scope.p)
		.then(
			function(rtn) {
				if (rtn.status == 200){
					// success				
					if (rtn.data.errors === undefined)
						$scope.showResults(rtn.data);			
				    else 
					   $scope.showError(rtn.data.errors[0].message);
				} else {
					// http failure
					$scope.showError(rtn.data.message);
				}
			},
			function(reason) {
				$scope.showError(reason);
			}
		);
	}
		
	$scope.showResults = function(rspHeader, rspData) {
		dialogServices.resultsDlg(rspHeader, rspData).result.then();
	}
		
	$scope.showError = function(msgText) {
		dialogServices.errorDlg("Error", msgText).result.then();
	}
}]

// This controller handles the results of the call to the ML Service
var	ResultsCtrl = ['$scope',	'$modalInstance',	'rspHeader', 'rspData', function ResultsCtrl($scope,	$modalInstance, rspHeader, rspData) {
	
	var formattedData = [];
	
	formattedData.push(rspData.values[0][0]); // Neighborhood
	formattedData.push(rspData.values[0][1]); // Bldg type
	
    formattedData.push(rspData.values[0][2].toString()); // Year built
	formattedData.push(rspData.values[0][3].toString()); // Volume Int
	formattedData.push(rspData.values[0][4].toString()); // Volume Oth
	formattedData.push(rspData.values[0][5].toString()); // Lot size
	formattedData.push(Math.round(rspData.values[0][9]).toLocaleString()); // Prediction
	
	$scope.rspData = [];
	$scope.rspHeader = rspHeader;	
	
	
	$scope.rspData.push(formattedData);
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

// This controller handles errors returned from the  call to the PM Service
var	ErrorCtrl = ['$scope',	'$modalInstance',	'msgTitle',	'message',
function ErrorCtrl($scope,	$modalInstance,	msgTitle,	message) {

	$scope.msgTitle	=	msgTitle;
	$scope.message = message;
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

DSERegressionTester.controller("AppCtrl",	AppCtrl);
DSERegressionTester.controller("ResultsCtrl", ResultsCtrl);
DSERegressionTester.controller("ErrorCtrl", ErrorCtrl);


