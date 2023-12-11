sap.ui.define([
    "sap/ui/core/Locale",
    "sap/ui/core/date/UI5Date",
], 
    function(Locale){
    "use strict"
    
    return {
        formatDate: function(isoDate){
                return new Date(isoDate).toLocaleDateString()
            },
    }
})