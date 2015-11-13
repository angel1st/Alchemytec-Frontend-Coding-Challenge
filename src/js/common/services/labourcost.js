"use strict";

/******************************************************************************************

Angular labourCost Service

This service maps backend data to frontend labourcost view
******************************************************************************************/

var app = angular.module("alchemytec.labourCost", []);

app.factory("labourCost", [ function() {
    return {
        fetchBody: function (table, costDataObj, totalWorkerCount) {
    		var fillRow = function (columns, costDataRow, totalWorkerCount, isDirectProvider) {
    			var row = {};
    			_.each(columns, function (column) {
    				var key = column.name;
    				switch (key) {
    					case 'providerName':
    						row[key] = costDataRow.name;
    						break;
    					case 'worker':
    						row[key] = costDataRow.workerCount;
    						break;
    					case 'complianceScore':
    						row[key] = costDataRow.complianceStats ? costDataRow.complianceStats.Total : 0;
    						break;
    					case 'grossPay':
    						row[key] = costDataRow.grossPayTotal;
    						break;
    					case 'payrollAdmin':
    						row[key] = costDataRow.payrollAdminTotal;
    						break;
    					case 'labourCost':
    						row[key] = costDataRow.labourCostTotal
    						break;
    					case 'workForce':
    						row[key] = totalWorkerCount ? costDataRow.workerCount / totalWorkerCount : null;
    						break;
    					case 'isDirectProvider':
    						row[key] = isDirectProvider;
    						break;
                        default:
                            row[key] = null;
                            break;
    				}
    			});
    			return row;
    		},
    		fillProviders = function (table, costDataProvidersArray, totalWorkerCount) {
    			table.body = table.body.concat(_.map(costDataProvidersArray, function (costDataRow) {
    				return fillRow(table.columns, costDataRow, totalWorkerCount, false);
    			}));
    		},
    		fillDirectProvider = function (table, costDataDirectProviderObj, totalWorkerCount) {
    			table.body.push(fillRow(table.columns, costDataDirectProviderObj, totalWorkerCount, true));
    		};
    		fillDirectProvider(table, costDataObj.directContractors[0], totalWorkerCount);
    		fillProviders(table, costDataObj.providers, totalWorkerCount);
    	},
        fetchFooter: function (table, totalObj) {
    		var fillRow = function (columns, totalObj) {
    			var row = {};
    			_.each(columns, function (column) {
    				var key = column.name;
    				switch (key) {
    					case 'providerName':
    						row[key] = 'total';
    						break;
    					case 'worker':
    						row[key] = totalObj.workerCount;
    						break;
    					case 'complianceScore':
    						row[key] = totalObj.complianceStats ? totalObj.complianceStats.Total : 0;
    						break;
    					case 'grossPay':
    						row[key] = totalObj.grossPayTotal;
    						break;
    					case 'payrollAdmin':
    						row[key] = totalObj.payrollAdminTotal;
    						break;
    					case 'labourCost':
    						row[key] = totalObj.labourCostTotal
    						break;
    					case 'workForce':
    						// no need to calculate, since all providers' work force field is calculated
    						row[key] = 1;
    						break;
                        case 'isFooter':
                            row[key] = true;
                            break;
                        default:
                            row[key] = null;
                            break;
    				}
    			});
    			return row;
    		}
            table.body.push(fillRow(table.columns, totalObj));
    	}
    };
}]);
