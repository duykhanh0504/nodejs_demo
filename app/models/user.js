// app/models/user.js
// INITILIAZE your model here
var connection = require('../../config/initializers/database');
var HttpStatus = require('http-status-codes');
//var gameserver_=require('../../config/initializers/server.js');
//var gameserver1 = require('E:\\Cafeword\\WorldCafe\\NodejsServer\\config\\initializers\\server');
var client=require('../server/client.js');
var upload =require('../models/upload');
var dateFormat = require('dateformat');
var server=require('../../config/initializers/server.js');
var util=require('../server/functionUtil.js');
var defines=require('../server/defines.js');

function User() {
//get all users
  this.getAll = function( res) {
    connection.acquire(function(err, con) {
      con.query('select * from Account', function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to get'});
        } else {
         res.send({status: HttpStatus.OK,result:result});
        }
      });
    });
  };
  //get user with id
  this.getInfromation_id = function(id, res) {
      var client_id=-1;
      if(client==null || client.account_id==id)
      {
        client_id=-1;
      }else
      {
          client_id=client.account_id();
      }


      //console.log("=======client_id=  "+client_id);
    connection.acquire(function(err, con) {

      con.query('call App_GetInformationUserByid(?,?)', [id,client_id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to get'+err});
        } else {
          res.send({status: HttpStatus.OK, result:result});
        }
      });
    });
  };
  //login

    var addlocation=function(body)
    {

        delete body.email;
        delete body.password;


        body.lasttimeonline=util.getcurrenttime();


//        console.log('add location %',body);

        connection.acquire(function(err, con) {
            console.log('addlocation:  '+body.account_id);
            con.query('call App_AddLocationUser(?,?,?,?) ', [body.account_id,body.location_lag,body.location_lng, body.lasttimeonline],function(err,result){
                con.release();
            });


        });
    }
    this.logout=function(account_id)
    {
        connection.acquire(function(err, con) {
            con.query('UPDATE Login SET islogin=?,lasttimelogout=? WHERE account_id =?', [2,util.getcurrenttime(), account_id], function(err, result) {
                con.release();
                if (err) {
                    console.log('update is fail pls check data again: '+err);
                } else {
                    console.log('update is Successfully');
                }
            });
        });
    }
    this.onLogin=function(body,res)
    {

        connection.acquire(function(err, con) {
            con.query('select *  from Account where email = ?', [body.email], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 404, message: 'server error '});
                } else {

                    if(result[0] == null)
                    {
                        res.send({status: 1, message: 'An email invalid'});
                    }
                    else
                    {
                        if (body.password == result[0].password)
                        {
                                       body.account_id=result[0].account_id;
                                        addlocation(body);
                                        res.send({status: HttpStatus.OK, message: 'Login successfully',result: result});
                        }
                        else
                        {
                            res.send({status: 2, message: 'Wrong password'});
                        }
                    }
                }
            });
        });
    }

    this.onLogin_NonPassWord=function(body,res)
    {

        if(body.device){
            if(body.device =='android')
            {
                if(body.version)
                {
                    if(body.version!=defines.currenversion_android)
                    {
                        if(defines.isupdate_android){
                        res.send({status: -100, message: 'old version'});
                        return;}
                    }

                }
            }

            if(body.device =='ios')
            {
              
                if(body.version)
                {
                    if(body.version !=defines.currenversion_IOS)
                    {
                        if(defines.isupdate_IOS){
                        res.send({status: -100, message: 'old version'});
                        return;
                        }
                    }

                }
            }

        }
        if (body.device != null)
        {
            connection.acquire(function(err, con) {
                con.query(' UPDATE Account set device = ? where email = ?', [body.device,body.email], function(err, result) {
                    con.release();
                    if (err) {
                        console.log('Update device error' + err)
                    } else {
                        //ok
                    }
                });
            });
        }

        connection.acquire(function(err, con) {
            con.query('select *  from Account where email = ?', [body.email], function(err, result) {
                con.release();
                if (err) {
                    res.send({status: 404, message: 'server error '});
                } else {

                    if(result[0] == null)
                    {
                        res.send({status: 1, message: 'An email invalid'});
                    }
                    else
                    {
                            body.account_id=result[0].account_id;
                            addlocation(body);
                            res.send({status: HttpStatus.OK, message: 'Login successfully',result: result});


                    }
                }
            });
        });


    }


this.updatesocket=function(body,res)
{
//    console.log("======================updatesocket");
    connection.acquire(function(err, con) {
        con.query('select * from Account where account_id = ?', [body.account_id], function(err, result) {
            con.release();
            if (err) {
                res.send({status: 3, message: 'Get user info failed'});
            } else {
                var room=[];
                var data={
                    username:result[0].username,
                    account_id :result[0].account_id,
                    room_id:room,
                    userData:result[0]
                };
                try{
                    client.updateInfo(data);
                }catch(err) {
                    console.log("==updatesocket is fail====================socket is null: "+err);
                }
                res.send({status: HttpStatus.OK, message: 'update socket is success'});
            }
        });
    });
}


    this.isReadTutorial=function(body,res)
    {
        connection.acquire(function(err, con) {

            con.query('call App_isReadTutorial(?) ', [body.account_id],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'App_isReadTutorial is fail'});
                }else
                {
                    res.send({status: 200, message: 'App_isReadTutorial is success'});
                }
            });


        });
    }

    this.setNotification=function(body,res)
    {
        connection.acquire(function(err, con) {

            con.query('call App_isNotification(?,?) ', [body.account_id,body.value],function(err,result){
                con.release();
                if(err)
                {
                    res.send({status: 3, message: 'App_isNotification is fail'});
                }else
                {
                    res.send({status: 200, message: 'App_isNotification is success'});
                }
            });


        });
    }


  //create new user
  this.create = function(body, res) {
    
    var decodeAvatar = unescape(body.avarta);
    body.avarta = decodeAvatar;
    connection.acquire(function(err, con) {
              con.query('insert into Account set ?', body, function(err, result) {
                con.release();
                if (err) {
                  res.send({status: 2, message: 'Signed up failed'});
                } else {
                  //sign up success
                  res.send({status: HttpStatus.OK, message: 'Signed up successfully'});
                }
              });
            });
  };
  
  this.uploadSingleImageIOS = function(url,body, res)
  {
    if(url != "" && url != null)
    {
      if (body.flat == "avatar")
      {
        body.avarta = url;
        delete body.flat;
          updateData(body,res)
      }
      else if(body.flat == "corver")
      {
        body.convertimage = url;
        delete body.flat;
        updateConvert(body,res);
      }
      
    }
    else
    {
      res.send({status: 1, message: 'upload failed'});
    }
  };
//update user with id
  this.update = function(body, res) {

      if(body.image!=null){

          upload.upload_image(body,function(url)
          {
              if(url!=null)
              {
                  body.avarta=url;
                  updateData(body,res)
              }
          });
      }else
      {
          updateData(body,res)
      }
  };




   function updateData(body,res)
    {

        body.update_date=util.getcurrenttime();
        connection.acquire(function(err, con) {
            delete body.base64;
            delete  body.image;
            delete body.type;
            con.query('update Account set ? where account_id = ?', [body, body.account_id], function(err, result) {
                con.release();
                if (err) {
                    console.log('============ err: '+err);
                    res.send({status: 1, message: 'Update failed'+err});
                } else {
                    res.send({status: HttpStatus.OK, url: body.avarta});
                }
            });
        });
    }




    this.updateConvert=function(body,res)
    {
        upload.upload_image(body,function(url)
        {
            if(url!=null)
            {
                body.convertimage=url;
                updateConvert(body,res);
            }
        });
    };

  function updateConvert(body,res)
  {
    connection.acquire(function(err, con) {
                      con.query('update Account set convertimage=? where account_id = ?', [body.convertimage, body.account_id], function(err, result) {
                          con.release();
                          if (err) {
                              res.send({status: 1, message: 'Update failed'});
                          } else {
                              res.send({status: HttpStatus.OK,url: body.convertimage});
                          }
                      });
                  });
  };
//delete user with id
  this.delete = function(id, res) {
    connection.acquire(function(err, con) {
      con.query('delete from Account where id = ?', [id], function(err, result) {
        con.release();
        if (err) {
          res.send({status: 1, message: 'Failed to delete'});
        } else {
          res.send({status: HttpStatus.OK, message: 'Deleted successfully'});
        }
      });
    });
  };

  this.searchUser=function(body,res)
  {
      connection.acquire(function(err, con) {
          con.query('call App_1_3_SearchUser_FullOption(?,?,?,?,?)', [body.beginYear,body.endYear,body.nationality,body.countrys,body.jobs], function(err, result) {
              con.release();
              if (err) {
                  res.send({status: 1, message: 'Failed to delete'});
              } else {
                  res.send({status: HttpStatus.OK, result:result});
              }
          });
      });
  };

  
}

module.exports = new User();