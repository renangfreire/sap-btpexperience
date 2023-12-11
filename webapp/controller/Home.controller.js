sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/lab2dev/finalprojectprodev/model/models",
],
    function (Controller, JSONModel, models) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.Home", {
            DialogTypes: [
                "RequestRegistrationPopup"
            ],
            onInit: function () {
                const oData = {
                    ID: "",
                    FullName: "",
                    CompanyName: "",
                    JobTitle: "",
                    AccessGroup: "",
                    PhoneNumber: "",
                    Email: "",
                    CPF: ""
                  }
                const oModel = new JSONModel(oData);

                this.oRouter = this.getOwnerComponent().getRouter();

                this.getView().setModel(oModel, "formData")
            },
            onAfterRendering: function () {
                // Pecado capital do UI5, porém to usando para um bem maior!
                const oElement = document.getElementById("application-comlab2devfinalprojectprodev-display")
                oElement.classList.remove("sapUShellApplicationContainerLimitedWidth")
            },
            onSendForm: function(oEvent){
                const oData = this.getView().getModel("formData").getData()

                const actualRequests = models.getRegistrationRequests().newRequests

                oData.ID = Number(actualRequests?.at(-1)?.ID) + 1 || 1; 
                oData.requestDate = new Date().toJSON();

                const oDataUpdated = {
                    newRequests: [...actualRequests, oData],
                }

                models.setRegistrationRequests(oDataUpdated)
                this.onOpenDialog(oEvent)
            }
        });
    });
