sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "com/lab2dev/finalprojectprodev/model/formatter",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast'
  ],
  function (BaseController, Fragment, formatter, JSONModel, MessageToast) {
    "use strict";

    return BaseController.extend("com.lab2dev.finalprojectprodev.controller.BaseController", {
      formatter: formatter,
      onOpenDialog(oEvent) {
        const sDialog = this.DialogTypes.find(el => oEvent.getSource().getId().includes(el))

        if (!this[sDialog]) {
          this[sDialog] = Fragment.load({
            name: `com.lab2dev.finalprojectprodev.view.fragments.${sDialog}`,
            controller: this
          })
        }

        this[sDialog].then(oDialog => {

          if(sDialog === "CreateUserManuallyDialog"){

            const oData = {
              ID: "",
              FullName: "",
              CompanyName: "",
              JobTitle: "",
              AccessGroup: "",
              PhoneNumber: "",
              Email: "",
              CPF: ""
            }

            const oModel = new JSONModel(oData)

            this.getView().setModel(oModel, "formData")
          }

          this.getView().insertDependent(oDialog)
          oDialog.open()
        })
      },
      onCloseDialog: function () {
        const sDialog = this.getView().getDependents().find(el => el.isOpen()).getId()

        this[sDialog].then((oDialog) => {
          oDialog.close()
        })
      },
      updateDataModel: function (oData) {
        const oModel = this.getView().getModel()

        const [sProperty, aData] = Object.entries(oData)[0]

        oModel.setProperty(`/${sProperty}`, aData)
      },
      showToast:function(sMessage){
        MessageToast.show(sMessage)
      },
      onListSelect: function(oEvent){
        const sTargetPage = oEvent.getParameter("key")
        
        this.oRouter.navTo(sTargetPage)
      }
    });
  }
);