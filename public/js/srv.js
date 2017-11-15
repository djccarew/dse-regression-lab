
var	sampleSrv = angular.module("sampleSrv",	[]);

// Call to Node.js backend to call PM Service instance
sampleSrv.factory("dataServices", ['$http',
function($http)	{

	this.getScore	=	function(p) {
		/* create the scoring input object */
		var input = {
			fields:  ["neighborhood","building_type","year_built","volume_interior","volume_other","lot_size"],
			values: [[ p.NEIGHBORHOOD,  p.BLDGTYPE, parseInt(p.YEARBUILT), parseInt(p.VOLUMEINT), parseInt(p.VOLUMEOTH), parseInt(p.LOTSIZE) ]]			
		};
        
      
		/* call	scoring service	to generate results */
		return $http({	method: "post",
  					    url: "score",
                        data: { input: input } 
                 })		
			.success(function(data, status, headers, config) {
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}

	return this;
}]);

// The modal dialogs for results and error
sampleSrv.factory("dialogServices",	['$modal', 
function($modal) {

	this.resultsDlg	=	function (r) {	
        var prettyHeader = ['Neighborhood', 'Building Type', 'Year Built','Interior Volume','Other Volume','Lot Size', 'Predicted Valuation'];	
		return $modal.open({
			templateUrl: 'partials/scoreResults.html',
			controller:	'ResultsCtrl',
			size:	'lg',
			resolve: {
				rspHeader: function	() {
					//return r[0].header;	
					return prettyHeader;
				},
				rspData: function	() {
				//	return r.result;	
					return r;	
				}
			}
		});		
	}
	
	this.errorDlg = function(msgTitle,	msgText) {
		return	$modal.open({
			templateUrl: 'partials/error.html',
			controller:	'ErrorCtrl',
			size:	'lg',
			resolve: {
				msgTitle:	function ()	{
					return msgTitle;
				},
				message: function	() {
					return msgText;
				}
			}
		});		
	}

	return this;
}]);

