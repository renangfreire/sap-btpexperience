sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment'
  ],
  function (BaseController, Fragment) {
    "use strict";

    return BaseController.extend("com.lab2dev.finalprojectprodev.controller.BaseController", {
      onOpenImportDialog(oEvent) {
        const sDialog = this.DialogTypes.find(el => oEvent.getSource().getId().includes(el))
      
        if (!this[sDialog]) {
          this[sDialog] = Fragment.load({
            name: `com.lab2dev.finalprojectprodev.view.fragments.${sDialog}`,
            controller: this
          })
        }

        this[sDialog].then(oDialog => {
          this.getView().insertDependent(oDialog)
          oDialog.open()
        })
      },
      onCloseDialog: function(){
        const sDialog = this.getView().getDependents().find(el => el.isOpen()).getId()

        this[sDialog].then((oDialog) => {
            oDialog.close()
        })
    }
    });
  }
);