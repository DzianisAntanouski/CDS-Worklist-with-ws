sap.ui.define(["sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"], function (Fragment, JSONModel) {
    "use strict";

    return {
        onInit: function () {
            var oSupportModel = new JSONModel({
                name: "",
                description: "",
                type: "text",
                value: "",
            });
            this.getView().setModel(oSupportModel, "supportModel");
            this.oSocket = new WebSocket("ws://localhost:4000/");
            var that = this;
            this.oSocket.onmessage = (oEvent) => {
                if (oEvent.data == 'refresh') that.getView().getModel().refresh();                                
            };
        },

        onPressCreate: function () {
            var oView = this.getView();
            if (!this._oCreateDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "worklist.ext.fragments.CreateDialog",
                    controller: this,
                }).then(
                    function (oDialog) {
                        this._oCreateDialog = oDialog;
                        oView.addDependent(this._oCreateDialog);
                        this._oCreateDialog.open();
                    }.bind(this)
                );
            } else {
                this._oCreateDialog.open();
            }
        },

        onPressCancel: function () {
            if (this._oCreateDialog) {
                this._oCreateDialog.close();
            }
        },

        onPressSave: function () {
            var oSupportModel = this.getView().getModel("supportModel");
            var that = this;
            var oModel = this.getView().getModel();
            var oData = oSupportModel.getData();
            var sType = oData.type;
            if (sType === "text" || sType === "url") {
                oModel.callFunction("/uploadData", {
                    method: "GET",
                    urlParameters: {
                        name: oData.name,
                        description: oData.description,
                        type: oData.type,
                        value: oData.value,
                    },
                    success: (oData, response) => {
                        this.oSocket.send(oData.uploadData);
                        that.clearDialogField();
                        oModel.refresh();
                    },
                });
            } else if (sType === "file") {
                var oFileUploader = this.getView().byId("_IDGenFileUploader1");
                var oFile = oFileUploader.oFileUpload.files[0];
                var oReader = new FileReader();
                oReader.onload = function (oEvent) {
                    var sContent = oEvent.target.result;
                    var aContentBytes = new TextEncoder().encode(sContent); // преобразуем в строку
                    oModel.callFunction("/uploadData", {
                        method: "GET",
                        urlParameters: {
                            name: oData.name,
                            description: oData.description,
                            type: oData.type,
                            value: aContentBytes, // передаем бинарные данные в формате String
                        },
                        success: (oData, response) => {
                            that.oSocket.send(oData.uploadData);                            
                            that.clearDialogField();
                            oModel.refresh();
                            
                        },
                    });
                };
                oReader.readAsBinaryString(oFile);
            }
            this.byId("createBtnButton").setEnabled(false);
            this._oCreateDialog.close();
            this.oSocket.send("update");
        },

        clearDialogField: function () {
            var oSupportModel = this.getView().getModel("supportModel");
            ["name", "description", "type", "value"].forEach((elem) => {
                elem == "type" ? oSupportModel.setProperty(`/${elem}`, "text") : oSupportModel.setProperty(`/${elem}`, "");
            });
            this.byId("createBtnButton").setEnabled(true);
        },

        onBeforeRebindTableExtension: function (oEvent) {
            var oTable = oEvent.getSource();
            if (!this._bIsDataReceivedHandlerAttached) {
                oTable.attachDataReceived(this.openSocket.bind(this));
                console.log("attached");
                this._bIsDataReceivedHandlerAttached = true;
            }
        },

        openSocket: async function (oEvent) {            
            if (this.oSocket.readyState !== WebSocket.OPEN) {
                await new Promise((resolve) => {
                    this.oSocket.addEventListener("open", resolve);
                });
            }        
            // var aItems = oEvent.getParameters().getParameter('data').results.filter(elem => elem.status == 'In Process')
            // if (aItems.length) {
            //     aItems.forEach(oItem => {
            //         this.oSocket.send(`${}`)
            //     })
            // }
        },
    };
});
