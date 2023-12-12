sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            _localStorage: window.localStorage,
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
             },
            _setTempImportUsers: async function(oUsers){
                const oData = {
                    ...oUsers,
                    timestamp: new Date()
                }

                this._localStorage.setItem("TempUsers", JSON.stringify(oData))
            },
            _getTempImportUsers: function(){
                const oData =  this._localStorage.getItem("TempUsers")
                
                return JSON.parse(oData)
            },
            _deleteTempImportUsers: function(){
               this._localStorage.removeItem("TempUsers")
            },
            getRegistrationRequests: function(){
                const aData = this._localStorage.getItem("registrationRequests")

                if(!aData){
                    return {newRequests: []}
                }

                return JSON.parse(aData)
            },
            setRegistrationRequests: function(oNewRequest){
                this._localStorage.setItem("registrationRequests", JSON.stringify(oNewRequest))
            },
            setUsers: async function(oUsers){
                const oData = oUsers
                this._localStorage.setItem("Users", JSON.stringify(oData))
            },
            getUsers: function(){
                const oData =  this._localStorage.getItem("Users")

                if(!oData){
                    return {Users: []}
                }
                
                return JSON.parse(oData)
            },
    };
});