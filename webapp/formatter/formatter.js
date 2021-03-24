sap.ui.define([], function () {
	"use strict";

	return {
		genderFormatter(sGenderKey) {
			let oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (sGenderKey === "M") {
				return oBundle.getText("gender.male");
			}
			return oBundle.getText("gender.female");
		}
	}
});