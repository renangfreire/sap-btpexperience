sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/lab2dev/finalprojectprodev/model/models",
],
    function (Controller, JSONModel, models) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.RegistrationRequests", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                const oData = models.getRegistrationRequests()

                const oModelViewDetails = new JSONModel({
                    // tableVisible: Object.keys(oData).length > 0,
                    deleteSelectedRow: null,
                    totalRequests: null,
                    bEditTableEnabled: false
                })

                
                const oModel = new JSONModel(oData)
                this.getView().setModel(oModel)
                this.getView().setModel(oModelViewDetails, "viewDetails")
            },
            onNavToRegisterNewUsers: function() {
                this.oRouter.navTo("RouteRegisterNewUsers")
            },
            onRefuseRegistration: function(oEvent) {
                const aSelectedIndices = this.byId("RegistrationRequestsTable").getSelectedIndices()


                debugger
            }
        });
    });
