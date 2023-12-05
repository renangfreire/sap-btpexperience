sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.RegisterNewUsers", {
            onInit: function () {

                const oModel = new JSONModel()
                oModel.loadData('/model/users.json')

                this.getView().setModel(oModel)
            },
            // Sei que posso jogar essas linhas na BASE, porém tenho que ver com relação ao THIS.DIALOG
        });
    });
