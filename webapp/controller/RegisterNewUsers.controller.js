sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "com/lab2dev/finalprojectprodev/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/model/odata/v2/ODataModel",
],
    function (Controller, models, JSONModel, ODataModel) {
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
            handleUploadStart: function(oEvent){
                const oFileUploader = oEvent.getSource()

                oFileUploader.checkFileReadable().then(() => {
                    const oFile = oFileUploader.oFileUpload.files[0]
                    this._uploadFile(oFile)
                }, function(err){
                    console.log("Upload Failed: " + err)
                }
                ).then(function() {
                    oFileUploader.clear()
                })

                this.onOpenImportDialog(oEvent)
            },
            _uploadFile: function(oFile){
                // O CERTO SERIA TER UMA VERIFICAÇÃO PRA SABER SE O ARQUIVO TA CERTO!
                const reader = new FileReader()

                reader.onload = (oEvent) => {
                    const stringCSV = oEvent.target.result
                    const arrCSV = stringCSV.split("\r\n").map(el => el.split(","))
                    const headerCSV = arrCSV.shift()

                    let aUsers = []
                    arrCSV.forEach((arrEntities) => {
                        const oUser = {}
                        arrEntities.forEach((ent, i) => {
                            oUser[headerCSV[i]] = ent
                        })

                        aUsers.push(oUser)
                    })

                    const oUsersImported = {"Users-PreRegister": aUsers}
                    models._setUsersLocalStorage(oUsersImported)

                    this.updateDataModel(oUsersImported)
                    
                    const oModel = this.getView().getModel()
                    oModel.setProperty("/viewDetails/tableVisible", true)
                }

                reader.readAsBinaryString(oFile);
            },
            ConfirmDeleteUser: function(oEvent){
                console.log(oEvent)
                debugger


                this.onCloseDialog(oEvent)
            }
        });
    });
