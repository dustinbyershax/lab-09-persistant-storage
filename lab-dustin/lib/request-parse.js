'use strict';

const url = require('url');
const querystring = require('querystring');


// callback signature is (err) => undefined
module.exports = (req, callback) => {
  req.url = url.parse(req.url);
  req.url.query = querystring.parse(req.url.query);

  // parse the body
  if(req.method === 'POST' || req.method === 'PUT'){
    let text = '';
    req.on('data', (buf) => {
      text  += buf.toString();
    });

    req.on('end', () => {
      // try and parse the string if its header.content-type === application json
      req.text = text;
      try {
        req.body = JSON.parse(text);
        callback(null);
      } catch (err){
        callback(err);
      }
    });

    req.on('err', (err) => {
      req.body = {};
      req.text = '';
      callback(err);
    });
  } else {
    req.text = '';
    req.body = {};
    callback(null);
  }
};
