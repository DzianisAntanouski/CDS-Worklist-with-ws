const modelsSrv = function(srv) {    

    srv.impl(async function() {
        this.after('READ', 'Models', modelsData => {
            const models = Array.isArray(modelsData) ? modelsData : [modelsData];
            function isLink(str) {
                const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
                return pattern.test(str);
              }
            models.forEach(model => {
                model.Status == 'ready' ? model.criticality = 3 : model.criticality = 2;
            })
            models.forEach(model => {
                isLink(model.URI) ? model.criticality = 3 : model.criticality = 2;
            })
        })
    })
};

module.exports = modelsSrv;