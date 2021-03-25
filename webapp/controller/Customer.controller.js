sap.ui.define([
	"at/clouddna/training00/FioriDeepDive/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
	"at/clouddna/training00/FioriDeepDive/formatter/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, Fragment, MessageBox, formatter, History) {
	"use strict";

	return BaseController.extend("at.clouddna.training00.FioriDeepDive.controller.Customer", {

		formatter: formatter,

		_fragmentList: {},
		_sMode: "",

		onInit: function () {
			this.getRouter().getRoute("Customer").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: function (oEvent) {
			let oEditModel = new JSONModel({
					editmode: false
				}),
				sCustomerId = oEvent.getParameter("arguments").customerid;

			this.setModel(oEditModel, "editModel");

			if (sCustomerId !== "create") {
				this._sMode = "display";
				this._showCustomerFragment("DisplayCustomer");
				this.getView().bindElement({
					path: "/CustomerSet(guid'" + sCustomerId + "')",
					events: {
						dataRequested: function () {
							this.logInfo("Customer " + sCustomerId + " was requested");
							this.getView().setBusy(true);
						}.bind(this),
						dataReceived: function (oData) {
							if (oData.getParameter("data")) {
								this.logInfo("Customer " + sCustomerId + " was received");
							} else {
								this.logError("Customer " + sCustomerId + " was not found");
							}

							this.getView().setBusy(false);
						}.bind(this),
					}
				});
				this.logInfo("Display Customer")
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

				this.setModel(oCreateModel, "createModel");

				oEditModel.setProperty("/editmode", true);
				this._showCustomerFragment("CreateCustomer");
				this.logInfo("Create Customer");
			}

		},

		onEditPress: function (oEvent) {
			this._toggleEdit(true);
		},

		onSavePress: function (oEvent) {
			this.getView().setBusy(true);

			if (this._sMode === "create") {
				let oModel = this.getModel(),
					oCreateData = this.getModel("createModel").getData();

				oModel.create("/CustomerSet", oCreateData, {
					success: function (oData, response) {
						this.logInfo("Customer was created");
						this.getView().setBusy(false);
						MessageBox.information(this.geti18nText("dialog.create.success"), {
							onClose: function () {
								this.onNavBack();
							}.bind(this),
						});
					}.bind(this),
					error: function (oError) {
						this.logError("Customer was not created");
						this.getView().setBusy(false);
						MessageBox.error(oError.message, {
							onClose: function () {
								this.onNavBack();
							}.bind(this)
						});
					}.bind(this)
				});
			} else {
				if (this.getModel().hasPendingChanges()) {
					this.getModel().submitChanges({
						success: function () {
							MessageBox.information(this.geti18nText("dialog.update.success"));
							this.logInfo("Customer saved");
							this.getView().setBusy(false);
						}.bind(this),
						error: function () {
							MessageBox.error(this.geti18nText("dialog.update.error"));
							this.logError("Customer was not saved");
							this.getView().setBusy(false);
						}.bind(this)
					});

				}
				this.getView().setBusy(false);
				this._toggleEdit(false);
			}
		},

		onCancelPress: function (oEvent) {
			MessageBox.confirm(this.geti18nText("dialog.cancel"), {
				onClose: function (sAction) {
					if (sAction === MessageBox.Action.OK) {
						if (this._sMode === "create") {
							this.onNavBack();
						} else {
							if (this.getModel().hasPendingChanges()) {
								this.getModel().resetChanges();
							}
							this._toggleEdit(false);
						}
					}
				}.bind(this)
			});
		},

		_toggleEdit: function (bEditMode) {
			let oModel = this.getView().getModel("editModel");

			oModel.setProperty("/editmode", bEditMode);

			this.setDirtyState(bEditMode);

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