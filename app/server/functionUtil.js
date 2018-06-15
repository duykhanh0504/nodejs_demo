/**
 * Created by Admin on 7/5/16.
 */
var dateFormat = require('dateformat');

exports.getcurrenttime=function()
{
    var now = new Date();
    return now.toUTCString();
}

var checkIsExit =exports.checkIsExit =function(array,item)
{
    if(array==null)
        return false;
    for(var i=0;i<array.length;i++)
    {

        if(array[i]==item)
        {

            return true;

        }


    }

    return false;
}

exports.addToList=function(array,item,ischeck)
{

    if(array==null)
        array=[];
    if(checkIsExit(array,item))
    {
       return array;
    }
    array.push(item+'');
    return array;
}

exports.removeFromList=function(array,values)
{

    if(array==null)
    {
        array=[];
        return array;
    }




    for(var i=0;i<array.length;i++)
    {
        if(array[i]==values)
        {

            array.splice(i,1);
        }

    }




    return array;
}

