
var report = require('../../app/models/report');

module.exports = function(router) {

    router.route('/reportuser')
        .post(function(req,res){
            report.report(req.body,res);
        });
    
};