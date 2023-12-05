sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment'
  ],
  function (BaseController, Fragment) {
    "use strict";

    return BaseController.extend("com.lab2dev.finalprojectprodev.controller.BaseController", {
      DialogTypes: ["DeleteUser", "ImportUser"],
      onOpenImportDialog(oEvent) {
        const sDialog = this.DialogTypes.find(el => oEvent.getSource().getId().includes(el))

        debugger

        if (!this[sDialog]) {
          this[sDialog] = Fragment.load({
            name: `com.lab2dev.finalprojectprodev.view.fragments.${sDialog}Dialog`,
            controller: this
          })
        }

        this[sDialog].then(oDialog => {
          this.getView().insertDependent(oDialog)
          oDialog.open()
        })
      },
      oncloseDialog: function(oEvent){
        const sDialog = this.DialogTypes.find(el => oEvent.getSource().getId().includes(el))

        this[sDialog].then((oDialog) => {
            oDialog.close()
        })
    }
    });
  }
);