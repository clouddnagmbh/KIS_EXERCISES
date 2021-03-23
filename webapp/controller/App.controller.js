sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, JSONModel, Fragment, MessageBox) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.App", {
		_fragmentList: {},

		onInit: function () {

			let oEditModel = new JSONModel({
				editmode: false
			});

			this.getView().setModel(oEditModel, "editModel");
			this._showCustomerFragment("DisplayCustomer");

		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			let oCustomer = this.getView().getModel().getProperty("/");

			this._toggleEdit(false);
			MessageBox.information(JSON.stringify(oCustomer));
		},

		_toggleEdit: function (bEditMode) {
			let oModel = this.getView().getModel("editModel");

			oModel.setProperty("/editmode", bEditMode);

			this._showCustomerFragment(bEditMode ? 'EditCustomer' : 'DisplayCustomer');
		},

		_showCustomerFragment: function (sFragmentName) {
			let oPage = this.getView().byId("page");

			oPage.removeAllContent();

			if (this._fragmentList[sFragmentName]) {
				oPage.insertContent(this._fragmentList[sFragmentName]);
			} else {
				Fragment.load({
					id: this.getView().createId(sFragmentName),
					name: "at.clouddna.training00.FioriDeepDive.view." + sFragmentName,
					controller: this
				}).then(function (oFragment) {
					this._fragmentList[sFragmentName] = oFragment;
					oPage.insertContent(this._fragmentList[sFragmentName]);
				}.bind(this));
			}
		}
	});
});