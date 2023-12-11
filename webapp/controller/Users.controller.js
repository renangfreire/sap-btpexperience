sap.ui.define([
    "com/lab2dev/finalprojectprodev/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/lab2dev/finalprojectprodev/model/models",
    'sap/ui/export/library',
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    function (Controller, JSONModel, models, exportLibrary, Spreadsheet, Filter, FilterOperator) {
        "use strict";
        const EdmType = exportLibrary.EdmType

        return Controller.extend("com.lab2dev.finalprojectprodev.controller.Users", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                const oData = models.getRegistrationRequests()

                const oModelViewDetails = new JSONModel({
                    totalUsers: null,
                    allCompanyNames: this._getAllCompanyNames(oData),
                    allJobTitles: this._getAllJobTitles(oData),
                    allAccessGroups: this._getAllAccessGroups(oData),
                })

                const oFiltersModel = new JSONModel({
                    searchQuery: "",
                    companySelected: "",
                    jobTitleSelected: "",
                    accessGroupSelected: ""
                })

                const oModel = new JSONModel(oData)

                oModelViewDetails.setProperty("/totalUsers", oData.newRequests.length)

                this.getView().setModel(oModel)
                this.getView().setModel(oModelViewDetails, "viewDetails")
                this.getView().setModel(oFiltersModel, "filters")
            },
            onNavToRegisterNewUsers: function() {
                this.oRouter.navTo("RouteRegisterNewUsers")
            },
            onOpenDisapproveDialog: function(oEvent){
                const aSelectedIndices = this.byId("RegistrationRequestsTable").getSelectedIndices()

                const oModel = new JSONModel({aSelectedIndices})

                this.getView().setModel(oModel, 'disapproveModel')
                this.onOpenDialog(oEvent)
            },
            onDisapproveRegistration: function(oEvent) {
                const {aSelectedIndices} = this.getView().getModel("disapproveModel").getData()

                const aData = models.getRegistrationRequests().newRequests
            
                const aDataFiltered = aData.filter((el, index) => !aSelectedIndices.some((i) => index === i))
                const oData = {
                    newRequests: aDataFiltered
                }

                models.setRegistrationRequests(oData)
                this.updateDataModel(oData)

                this._setTotalRegistrationRequests(aDataFiltered)

                this.onCloseDialog()
            },
            onOpenApproveDialog: function(oEvent){
                const aSelectedIndices = this.byId("RegistrationRequestsTable").getSelectedIndices()

                const oModel = new JSONModel({aSelectedIndices})

                this.getView().setModel(oModel, 'approveModel')
                this.onOpenDialog(oEvent)
            },
            _getTotalRegistrationRequests: function(){

            },
            _setTotalRegistrationRequests: function(aData) {
                this.getView().getModel("viewDetails")
                .setProperty("/totalUsers", aData.length)
            },
            onEnableEdit: function(){
                this._toggleEdit()
            },
            onConfirmEdit: function(){
                this._toggleEdit()

                const oData = this.getView().getModel().getData()
                models.setRegistrationRequests(oData)
            },
            _toggleEdit(){
                const oModel = this.getView().getModel("viewDetails")
                const actualHandle = oModel.getProperty("/bEditTableEnabled")
                oModel.setProperty("/bEditTableEnabled", !actualHandle)
            },
            createColumnConfig: function(){
                // '2023-12-09'
                return [{
                    label: "ID",
                    property: "ID",
                    type: EdmType.Number,
                    scale: 0
                },
                {
                    label: "Full Name",
                    property: "FullName",
                    width: "30"
                },
                {
                    label: "Empresa",
                    property: "CompanyName",
                    width: "20"
                },
                {
                    label: "Cargo",
                    property: "JobTitle",
                    width: "18"
                },
                {
                    label: "Grupo de Acesso",
                    property: "AccessGroup",
                    width: "10"
                },
                {
                    label: "E-mail",
                    property: "Email",
                    width: "30"
                },
                {
                    label: "CPF",
                    property: "CPF",
                    width: "18"
                },
                {
                    label: "Data de solicitação",
                    property: "requestDate",
                    type: EdmType.Date,
                    width: "10"
                }
            ]
            },
            exportExcelFile: function(){
                const oTable = this.byId("RegistrationRequestsTable")
                const oBinding = oTable.getBinding("rows");
                const aCols = this.createColumnConfig()

                const oSettings = {
                    workbook: {columns: aCols},
                    dataSource: oBinding,
                    fileName: "Users Requests Table",
                }

                const oSheet = new Spreadsheet(oSettings)
                oSheet.build()
                    .then(function(){
                        this.showToast("Excel Exported")
                    }).finally(() => {
                        oSheet.destroy()
                    })
            },
            onSearch: function(oEvent){
                const aFilters = []
                const sQuery = oEvent.getSource().getValue()

                if(sQuery){
                    const oFilter = new Filter({
                        filters: [
                            new Filter("FullName", FilterOperator.Contains, sQuery),
                            new Filter("Email", FilterOperator.Contains, sQuery),
                            new Filter("CPF", (sValue) => sValue.split(/[.-]/g).join('').includes(sQuery))
                        ]
                    })

                    aFilters.push(oFilter)
                }

                const oTable = this.byId("RegistrationRequestsTable")
                const oRows = oTable.getBinding("rows")

                oRows.filter(aFilters)
            },
            onApplyFilters: function() {
                const oFiltersData = this.getView().getModel("filters").getData()

                const aFilters = []

                if(oFiltersData.companySelected){
                    const oFilter = new Filter("CompanyName",  FilterOperator.EQ, oFiltersData.companySelected)

                    aFilters.push(oFilter)
                }

                if(oFiltersData.searchQuery){
                    const oFilter = new Filter({
                            filters: [
                                new Filter("FullName", FilterOperator.Contains, oFiltersData.searchQuery),
                                new Filter("Email", FilterOperator.Contains, oFiltersData.searchQuery),
                                new Filter("CPF", (sValue) => sValue.split(/[.-]/g).join('').includes(oFiltersData.searchQuery))
                            ],
                            and: false
                    })

                    aFilters.push(oFilter)
                }

                if(oFiltersData.jobTitleSelected){
                    const oFilter = new Filter("JobTitle", FilterOperator.EQ, oFiltersData.jobTitleSelected)

                    aFilters.push(oFilter)
                }

                if(oFiltersData.accessGroupSelected){
                    const oFilter = new Filter("AccessGroup", FilterOperator.EQ, oFiltersData.accessGroupSelected)

                    aFilters.push(oFilter)
                }

                console.log(aFilters)

                const oFilters = new Filter({
                    filters: aFilters,
                    and: true
                })

                const oTable = this.byId("RegistrationRequestsTable")
                const oBinding = oTable.getBinding("rows")

                oBinding.filter([oFilters])
            }, 
            onClearFilters: function(){
                const oDataRedefined = {
                    searchQuery: "",
                    companySelected: "",
                    jobTitleSelected: "",
                    accessGroupSelected: ""
                }

                this.getView().getModel("filters").setData(oDataRedefined)

                const oTable = this.byId("RegistrationRequestsTable")
                const oBinding = oTable.getBinding("rows")

                oBinding.filter([])
            },
            _getAllCompanyNames: function(oData){
                const aCompanies = oData.newRequests.map(request => request.CompanyName)
                const setCompanies = new Set(aCompanies)

                return [...setCompanies]
            },
            _getAllJobTitles: function(oData){
                const aJobTitles = oData.newRequests.map(request => request.JobTitle)
                const setJobTitle = new Set(aJobTitles)

                return [...setJobTitle]
            },
            _getAllAccessGroups: function(oData){
                const aAccessGroups = oData.newRequests.map(request => request.AccessGroup)
                const setAccessGroup = new Set(aAccessGroups)

                return [...setAccessGroup]
            }
        });
    });