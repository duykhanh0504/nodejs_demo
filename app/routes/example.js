// app/routes/users.js
var users = require('../../app/models/user');

module.exports = function(router) {
//example: http://locallhost:8080/api/example/4
  router.route('/:id')
  .get(function(req, res) {
    users.get(req.params.id,res);
  })
      .delete(function(req,res){
        users.delete(req.params.id,res);
      })
  .put(function(req,res){
    users.update(req.body,res);
  });
//example: http://locallhost:8080/api/example
  router.route('/')
      .get(function(req,res){
              console.log("test");
        users.getAll(res);
      })
      .post(function(req,res){
        users.create(req.body,res);
      });


};
