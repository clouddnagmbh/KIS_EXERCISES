sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, Fragment, MessageBox, formatter, History) {
	"use strict";

	return Controller.extend("at.clouddna.training00.FioriDeepDive.controller.Customer", {

		formatter: formatter,

		_fragmentList: {},
		_sMode: "",

		onInit: function () {

			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let oEditModel = new JSONModel({
					editmode: false
				}),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.getView().setModel(oEditModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement("/CustomerSet(guid'" + sCustomerId + "')");
			} else {
				this._sMode = "create";

				let oCreateModel = new JSONModel({
					Firstname: "",
					Lastname: "",
					AcademicTitle: "",
					Gender: "M",
					Email: "",
					Phone: "",
					Website: ""
				});

				this.getView().setModel(oCreateModel, "createModel");

				oEditModel.setProperty("/editmode", true);
				this._showCustomerFragment("CreateCustomer");
			}

		},

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

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			if (this._sMode === "create") {
				let oModel = this.getView().getModel(),
					oCreateData = this.getView().getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, response) {
						MessageBox.information(oBundle.getText("dialog.create.success"), {
							onClose: function () {
								this.onNavBack();
							}.bind(this),
						});
					}.bind(this),
					error: function (oError) {
						MessageBox.error(oError.message, {
							onClose: function () {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this)
				});
			} else {
				if (this.getView().getModel().hasPendingChanges()) {
					this.getView().getModel().submitChange();
					MessageBox.information(oBundle.getText("dialog.update.success"));
				}
			}
		},

		onCancelPress: function (oEvent) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

			MessageBox.confirm(oBundle.getText("dialog.cancel"), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.onNavBack();
						} else {
							if (this.getView().getModel().hasPendingChanges()) {
								this.getView().getModel().resetChanges();
								this._toggleEdit(false);
							}
						}
					}
				}.bind(this)
			});
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