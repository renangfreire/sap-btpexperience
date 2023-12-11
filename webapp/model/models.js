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
            getJsonData: function(){
                    try {
                        const oData = this._getUsersLocalStorage() || {}

                        return new Promise(
                            function(resolve, reject) {
                                if(oData){
                                    resolve(oData)
                                }
                                    reject("Cannot find data")
                                })
                    } catch (error) {
                        console.log("Couldn't load JSON Data Service")
                    }
            },
            _setUsersLocalStorage: async function(oUsers){
                const oData = oUsers

                this._localStorage.setItem("oData", JSON.stringify(oData))
            },
            _getUsersLocalStorage: function(){
                const oData =  this._localStorage.getItem("oData")
                
                return JSON.parse(oData)
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
            deleteUserSelected: function(userSelected){
                const oData = this._getUsersLocalStorage()

                const aWithoutUser = oData["Users-PreRegister"].filter(el => el.ID !== userSelected.ID)

                const oDataProcessed = {
                    "Users-PreRegister": aWithoutUser
                }

                this._setUsersLocalStorage(oDataProcessed)

                return oDataProcessed
            }
    };
});