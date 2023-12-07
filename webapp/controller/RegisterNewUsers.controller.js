sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "com/lab2dev/finalprojectprodev/model/models",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
],
    function (Controller, models, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.RegisterNewUsers", {
            DialogTypes: [
                "DeleteUserDialog",
                "ImportUserDialog", 
                "CreateUserManuallyDialog", 
                "ConfirmUserImportDialog",
                "CancelUserImportDialog"
            ],
            buttonSelected: null,
            onInit: function () {

                const oModelPromise = models.getJsonData()

                oModelPromise.then(oData => {

                    const oModel = new JSONModel({
                        ...oData,
                        viewDetails: {
                            tableVisible: Object.keys(oData).length > 0,
                            deleteSelectedRow: null,
                            totalRegistrations: null
                        }
                    })

                    this.getView().setModel(oModel)
                    
                    this._setTotalRegistrations(oData["Users-PreRegister"])

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
                    this._setTotalRegistrations(aUsers)
                }

                reader.readAsBinaryString(oFile);
            },
            onOpenDeleteDialog: function(oEvent){
                const oModel = this.getView().getModel()

                const selectedRow = oEvent.getSource().getParent().getId().split("row").at(-1)

                oModel.setProperty("/viewDetails/deleteSelectedRow", selectedRow)
                this.onOpenDialog(oEvent)
            },
            ConfirmDeleteUser: function(oEvent){
                const oModel = this.getView().getModel()
                const sSelectedIndex = oModel.getProperty("/viewDetails/deleteSelectedRow")

                // Parte de código estática, se alterar o JSON quebra
                const oSelectedRow = oModel.getData()["Users-PreRegister"].at(sSelectedIndex)

                const oData = models.deleteUserSelected(oSelectedRow)

                this.updateDataModel(oData)

                this.onCloseDialog(oEvent)
            },
            onSearch: function(oEvent){
                const sQuery = oEvent.getSource().getValue()
                this._applyFilter(sQuery)
            },
            _applyFilter: function(sQuery){
                const aFilters = []

                if(sQuery){
                    const oFilter = new Filter({ filters: [
                        new Filter("FullName", FilterOperator.Contains, sQuery),
                        new Filter("Email", FilterOperator.Contains, sQuery),
                        new Filter("CPF", (oVal) => oVal.split('-').join('').includes(sQuery))
                    ]})
                    aFilters.push(oFilter)
                }

                const rows = this.byId("UsersPreRegisterTable").getBinding("rows")
                rows.filter(aFilters)

                this._setTotalRegistrations(rows.aIndices)
            },
            _setTotalRegistrations: function(aData){
                const oModel = this.getView().getModel()

                oModel.setProperty("/viewDetails/totalRegistrations", aData.length)
            }
        });
    });
