var connection = require('../../config/initializers/database');

function Report() {


    this.report=function(body,res)
    {
    	console.log("id send: "+ body.id_send);
    	console.log("id recieved: "+ body.id_recieved);
    	console.log("category: "+ body.category);
    	console.log("content: "+ body.content);
         connection.acquire(function(err,con){
                con.query('insert into Report set ?', body, function(err, result){
                    con.release();
                    if(err){
                        res.send({status: 1, message: 'report failed'});
                    }else {
                        res.send({status: 200, message: 'Report successfully'});
                    }
                });
            });
    };


}
module.exports = new Report();