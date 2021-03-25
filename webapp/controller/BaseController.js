sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/base/Log"
], function (Controller, History, Log) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.BaseController", {
		_sContentDensityClass: null,

		onNavBack: function (oEvent) {
			let oHistory = History.getInstance(),
				oPreviousHash = oHistory.getPreviousHash();

			if (oPreviousHash) {
				window.history.go(-1);
			} else {
				let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

				oRouter.navTo("Main", true);
			}
		},

		setDirtyState: function (bState) {
			if (sap.ushell) {
				sap.ushell.Container.setDirtyFlag(bState);

				let sState = bState ? 'true' : 'false';
				this.logInfo("Dirty-Flag set to: " + sState);
			}

			this.logWarning("Can't set dirty-flag: Not in Launchpad Mode");
		},

		getRouter: function () {
			//set Content Density
			this.setContentDensity();

			this.logInfo("Fetching Router");
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		setContentDensity: function () {
			this.getView().addStyleClass(this._getContentDensitClass());
			this.logInfo("Content Density set to " + this._sContentDensityClass);
		},

		_getContentDensitClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}

			return this._sContentDensityClass;

		},

		logDebug: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.debug("Debug: " + sMessage);
		},

		logInfo: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.info("Info: " + sMessage);
		},

		logError: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.error("Error: " + sMessage);
		},

		logFatal: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.fatal("Fatal: " + sMessage);
		},

		logWarning: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.warning("Warning: " + sMessage);
		},

		logTrace: function (sMessage) {
			let oLogger = Log.getLogger(this.getView().getControllerName());
			oLogger.info("Trace: " + sMessage);
		},

		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		geti18nText: function (sId, aParams) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			return oBundle.getText(sId, aParams);
		}
	});
});