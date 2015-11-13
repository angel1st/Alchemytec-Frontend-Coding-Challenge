"use strict";

/******************************************************************************************

Labour Cost Report controller

******************************************************************************************/

var app = angular.module("labourcost.controller", []);

app.controller("ctrlLabourCost", ["$rootScope", "$scope", "$timeout", "restalchemy", "navigation", 'labourCost',
	function LabourCostCtrl($rootScope, $scope, $timeout, $restalchemy, $navigation, $labourCost) {
	// Set the navigation tabs
	$navigation.select({
		forward: "reports",
		selected: "labourreport"
	});

	// Initialise the REST api
	var rest = $restalchemy.init({ root: $rootScope.config.api.labourstats.root });
	rest.api = $rootScope.config.api.labourstats;

	// define table
	$scope.table = {
		// columns mapping
		columns: [
			{name: 'providerName', label: 'payroll provider', class:'col-5 padded'},
			{name: 'worker', label: 'worker', class:'col-3 padded-lr'},
			{name: 'complianceScore', label: 'compliance score', class:'col-3 padded'},
			{name: 'grossPay', label: 'gross pay (\u00A3)', class:'col-4 figures padded'},
			{name: 'payrollAdmin', label: 'payroll admin (\u00A3)', class:'col-3 figures padded'},
			{name: 'labourCost', label: 'labour cost (\u00A3)', class:'col-4 figures padded-lr'},
			{name: 'workForce', label: 'work force', class:'col-3 padded-lr'},
			// will indicate direct provider row, since it will require special treatment when sort
			// null label will indicate hidden column
			{name: 'isDirectProvider', label: null},
			{name: 'isFooter', label: null}
		],
		// holds both the body & the footer
		body: [],
		// holds current table sort column's name
		sortType: null,
		// initially ascending sort is set
		sortReverse: false,
		// called when clicked on table's column
		sort: function ($index) {
			if ($scope.table.sortType === $scope.table.columns[$index].name) {
				// when sort column keeps the same, reverse order only
				$scope.table.sortReverse = !$scope.table.sortReverse;
			} else {
				// when sort column changes, reset sort order, as well
				$scope.table.sortType = $scope.table.columns[$index].name;
				$scope.table.sortReverse = false;
			}
		},
		// helper function - returns true if current column sort is ascending
		isAsc: function ($index) {
			return $scope.table.sortType === $scope.table.columns[$index].name && !$scope.table.sortReverse;
		},
		// helper function - returns true if current column sort is descending
		isDesc: function ($index) {
			return $scope.table.sortType === $scope.table.columns[$index].name && $scope.table.sortReverse;
		},
		// helper function - returns true if table is sorted by providers' name column
		isSortedByProviderName: function () {
			return $scope.table.sortType === 'providerName';
		},
		// getter function for orderBy filter
		compare: function (row) {
			if (row['isFooter']) {
				// this is footer, make sure it is always at the bottom
				if ($scope.table.isSortedByProviderName()) {
					// this column is string, return string
					return $scope.table.sortReverse ? '\u0000' : '\u00FF';
				} else {
					// the rest of the columns are numbers, return number
					return $scope.table.sortReverse ? -1 : Number.MAX_SAFE_INTEGER;
				}
			}
			if ($scope.table.isSortedByProviderName() && row['isDirectProvider']) {
				// ok, this is the special case - make sure, direct providers row is always on top
				return $scope.table.sortReverse ? '\u00FF' : '\u0000';
			} else {
				// otherwise - sort alphabetically
				return row[$scope.table.sortType];
			}
		},
		init: function () {
			this.sortType = this.columns[0].name;
		}
	};

	// init table propertie(s)
	$scope.table.init();

	rest.at(rest.api.costs).get().then(function(costdata) {
		// make sure, the right data types has been delivered
		if (_.isArray(costdata) && _.isObject(costdata[0]) && _.isArray(costdata[0].total)) {
			// all is good, let's proceed with body & footer fetching
			$labourCost.fetchBody($scope.table, costdata[0], costdata[0].total[0].workerCount);
			$labourCost.fetchFooter($scope.table, costdata[0].total[0]);
		}
	});
}]);
