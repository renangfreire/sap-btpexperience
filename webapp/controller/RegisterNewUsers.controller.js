sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
    function (Controller, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.RegisterNewUsers", {
            onInit: function () {
                const testData = [
                    {id: 1, name: "Roger"},
                    {id: 2, name: "Vinicius"},
                    {id: 3, name: "Davi"},
                    {id: 1, name: "Roger"},
                    {id: 2, name: "Vinicius"},
                    {id: 3, name: "Davi"},
                    {id: 1, name: "Roger"},
                    {id: 2, name: "Vinicius"},
                    {id: 3, name: "Davi"},
                    {id: 1, name: "Roger"},
                    {id: 2, name: "Vinicius"},
                    {id: 3, name: "Davi"},
                ]  

                const oModel = new JSONModel({Users: testData})

                this.getView().setModel(oModel)
            },
            // Sei que posso jogar essas linhas na BASE, porém tenho que ver com relação ao THIS.DIALOG
            onOpenImportDialog: function() {
                if(!this.dialog){
                    this.dialog = Fragment.load({
                        name: "com.lab2dev.finalprojectprodev.view.fragments.ImportUserDialog",
                        controller: this
                    })
                }

                this.dialog.then(oDialog => {
                    this.getView().insertDependent(oDialog)
                    oDialog.open()
                })

            },
            oncloseDialog: function(){
                this.dialog.then((oDialog) => {
                    oDialog.close()
                })
            }
        });
    });
