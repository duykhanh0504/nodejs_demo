/**
 * Created by Admin on 3/15/16.
 */
var express    = require('express');        // call express
var bodyParser = require('body-parser');
var request = require('request');

var host='https://maps.googleapis.com/maps/api/place/';
var key_google='AIzaSyAEPlTXKUSYIJEJCJSs5RTmrkL-Liqtsfs';
var name_add_googleplace='dieuteccst';

var add_place_link='add/json?key=' + key_google;
var search_friends='search/json?key=' + key_google + '&radius=100&sensor=true&name='+name_add_googleplace + '&location=';

var GOOGLE_PLACES_API_KEY = key_google;
var GOOGLE_PLACES_OUTPUT_FORMAT = "json";

module.exports = function(router) {
    'use strict';
    router.route('/searchnearfriends').get(function(req,res){
        var GooglePlaces = require('googleplaces');
        var googlePlaces = new GooglePlaces(key_google, "json");

        console.log("jsonContent: "+req.query.lat +req.query.lng)
        var lat=req.query.lat;
        var lng=req.query.lng;
        var parameters;

        parameters = {
            name:name_add_googleplace,
            location: [lat,lng],
            radius:500,
            sensor:false
        };
        googlePlaces.nearBySearch(parameters, function (error, response) {
            if (!error) {
                return res.json({message:response.results})
            }
        });
    });

}
