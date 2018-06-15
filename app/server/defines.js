/**
 * Created by Dieu Nguyen on 5/11/16.
 */

exports.currenversion_android="1.2";
exports.isupdate_android=false;

exports.currenversion_IOS="1.0";
exports.isupdate_IOS=false;

exports.MessageToClient =
{
    ChatPublic          : 1,
    ChatPrivate         : 2,
    DisChatPrivate			: 3,
    PlayerLeftRoom      : 4,
    loginOk:5,
    Disconnect:6,
    Logout:7,
    createroom:8,
    NewMember:9,
    Leaveroom:10,
    AddToRoom:11


};
exports.RequestType = {
    JoinRoom:1,
    LeftRoom:2,
    CreateRoom:3,
    InviteUser:4

};


exports.MessageTypeClient_Server = {

    ChatPublic          : 1,
    ChatPrivate         : 2
};
exports.ErrorCode =
{
    OK: 0,
    FAILED: 1,
    NOT_FOUND: 2,
    ALREADY_IN_ROOM: 3,
    NOT_AVAILABLE:4
};

exports.KeyMessageToClient='server_to_client';



exports.MessageType={
  text:'text',
  image:'image',
  record:'record',
  notification:'notification'
};

exports.MessagePush={
    addfriend:1,
    cancelrequestfriend:2,
    acceptrequestfriend:3,
    newmessage:4,
    newuser_joinroom:5,
    user_leave_room : 6,
    user_like_timeline:7,
    user_comment_timeline:8,
    create_room:9,
    invite_to_room:10

};
//exports.MessageAddFriend="add friend";

exports.keypush='worldcafe';

