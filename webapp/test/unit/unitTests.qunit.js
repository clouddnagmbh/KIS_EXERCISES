/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"at/clouddna/training00/FioriDeepDive/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});