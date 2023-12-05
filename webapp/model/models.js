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
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
            getJsonData: async function(){
                const oModel = new JSONModel()

                try {
                    await oModel.loadData('/model/users.json')

                    return new Promise(function(resolve, reject) {
                        if(oModel.getData()){
                            resolve(oModel)
                        }
                        reject(new Error)
                    })
                } catch (error) {
                    console.log("Couldn't load JSON Data Service")
                }
        },
        _localStorage: function(){
            return window.localStorage
        }
    };
});