sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "com/lab2dev/finalprojectprodev/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
],
    function (Controller, models,JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.RegisterNewUsers", {
            DialogTypes: [
                "DeleteUserDialog",
                "ImportUserDialog", 
                "CreateUserManuallyDialog", 
                "ConfirmUserImportDialog",
                "CancelUserImportDialog"
            ],
            onInit: function () {

                const oModelPromise = models.getJsonData()

                oModelPromise.then(oModel => {
                    this.getView().setModel(oModel)
                }).catch(error => console.log(error))

            },
        });
    });
