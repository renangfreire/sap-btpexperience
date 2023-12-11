sap.ui.define(
    [
        "com/lab2dev/finalprojectprodev/controller/BaseController",
        "com/lab2dev/finalprojectprodev/model/models",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function (Controller, models, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend(
            "com.lab2dev.finalprojectprodev.controller.RegisterNewUsers", {
                DialogTypes: [
                    "DeleteUserDialog",
                    "ImportUserDialog",
                    "CreateUserManuallyDialog",
                    "ConfirmUserImportDialog",
                    "CancelUserImportDialog",
                ],
                buttonSelected: null,
                onInit: function () {
                    const oModelPromise = models.getJsonData();

                    this.oRouter = this.getOwnerComponent().getRouter();

                    oModelPromise
                        .then((oData) => {
                            const oModel = new JSONModel(oData);

                            const oModelViewDetails = new JSONModel({
                                    tableVisible: Object.keys(oData).length > 0,
                                    deleteSelectedRow: null,
                                    totalRegistrations: null,
                                    bEditTableEnabled: false
                                })


                            this.getView().setModel(oModel);

                            this.getView().setModel(oModelViewDetails, "viewDetails")

                            this._setTotalRegistrations(oData["Users-PreRegister"]);
                        })
                        .catch((error) => console.log(error));
                },
                handleUploadStart: function (oEvent) {
                    const oFileUploader = oEvent.getSource();

                    oFileUploader
                        .checkFileReadable()
                        .then(
                            () => {
                                const oFile = oFileUploader.oFileUpload.files[0];
                                this._uploadFile(oFile);
                            },
                            function (err) {
                                console.log("Upload Failed: " + err);
                            }
                        )
                        .then(function () {
                            oFileUploader.clear();
                        });

                    this.onOpenDialog(oEvent);
                },
                _uploadFile: function (oFile) {
                    // O CERTO SERIA TER UMA VERIFICAÇÃO PRA SABER SE O ARQUIVO TA CERTO!
                    const reader = new FileReader();

                    reader.onload = (oEvent) => {
                        const stringCSV = oEvent.target.result;
                        const arrCSV = stringCSV.split("\r\n").map((el) => el.split(","));
                        const headerCSV = arrCSV.shift();

                        let aUsers = [];
                        arrCSV.forEach((arrEntities) => {
                            const oUser = {};
                            arrEntities.forEach((ent, i) => {
                                oUser[headerCSV[i]] = ent;
                            });

                            aUsers.push(oUser);
                        });

                        const oUsersImported = {
                            "Users-PreRegister": aUsers,
                        };

                        models._setUsersLocalStorage(oUsersImported);

                        this.updateDataModel(oUsersImported);

                        const oModel = this.getView().getModel("viewDetails");

                        oModel.setProperty("/tableVisible", true);
                        this._setTotalRegistrations(aUsers);
                    };

                    reader.readAsBinaryString(oFile);
                },
                onOpenDeleteDialog: function (oEvent) {
                    const oModel = this.getView().getModel("viewDetails");

                    // Pegando o index com base na property de acessibilidade
                    // GAMBIARRA ABSURDA, crtz que tem uma forma melhor!
                    const selectedRow = oEvent.getSource().getParent().getDomRef().ariaRowIndex - 2;

                    oModel.setProperty("/deleteSelectedRow", selectedRow);
                    this.onOpenDialog(oEvent);
                },
                ConfirmDeleteUser: function (oEvent) {
                    const oViewDetailsModel = this.getView().getModel("viewDetails");
                    const sSelectedIndex = oViewDetailsModel.getProperty(
                        "/deleteSelectedRow"
                    );

                    // Parte de código estática, se alterar o JSON quebra
                    const oModel = this.getView().getModel()
                    const aUsers = oModel.getData()["Users-PreRegister"];
                    const oSelectedRow = aUsers.at(sSelectedIndex);

                    const oData = models.deleteUserSelected(oSelectedRow);

                    this.updateDataModel(oData);
                    this._setTotalRegistrations(oModel.getData()["Users-PreRegister"]);

                    this.onCloseDialog(oEvent);
                },
                onSearch: function (oEvent) {
                    const sQuery = oEvent.getSource().getValue();
                    this._applyFilter(sQuery);
                },
                _applyFilter: function (sQuery) {
                    const aFilters = [];

                    if (sQuery) {
                        const oFilter = new Filter({
                            filters: [
                                new Filter("FullName", FilterOperator.Contains, sQuery),
                                new Filter("Email", FilterOperator.Contains, sQuery),
                                new Filter("CPF", (oVal) =>
                                    oVal.split(/[.-]/g).join("").includes(sQuery)
                                ),
                            ],
                        });
                        aFilters.push(oFilter);
                    }

                    const rows = this.byId("UsersPreRegisterTable").getBinding("rows");
                    rows.filter(aFilters);

                    this._setTotalRegistrations(rows.aIndices);
                },
                _setTotalRegistrations: function (aData) {
                    const oModel = this.getView().getModel("viewDetails");

                    oModel.setProperty("/totalRegistrations", aData.length);
                },
                _getTotalRegistrations: function(){
                    const oModel = this.getView().getModel("viewDetails");

                    return oModel.getProperty("/totalRegistrations");
                },
                onEnableEdit: function(){
                    const oModel = this.getView().getModel("viewDetails");

                    oModel.setProperty("/bEditTableEnabled",  true)
                },
                onConfirmEdit: function(oEvent){
                    const oViewDetailsModel = this.getView().getModel("viewDetails");
                    const oData = this.getView().getModel().getData()

                    models._setUsersLocalStorage(oData)

                    oViewDetailsModel.setProperty("/bEditTableEnabled",  false)
                },
                onSendForm: function(oEvent){
                    const oModelForm = this.getView().getModel("formData").getData()
                    const oModel = this.getView().getModel()

                    const oData = oModel.getData()["Users-PreRegister"]

                    const aData = [...oData, {
                        ...oModelForm,
                        ID: this._getTotalRegistrations() + 1
                    }]

                    const oDataChanged = {
                        "Users-PreRegister": aData}

                    oModel.setData(oDataChanged)
                    models._setUsersLocalStorage(oDataChanged)
                    this._setTotalRegistrations(aData)

                  this.onCloseDialog(oEvent)
                },
                onCancelImport: function(){
                    const oViewDetailsModel = this.getView().getModel("viewDetails")
                    const oModel = this.getView().getModel()

                    oModel.setData({})
                    oViewDetailsModel.setProperty("/tableVisible", false)

                    this.onCloseDialog()
                }
            }
        );
    }
);