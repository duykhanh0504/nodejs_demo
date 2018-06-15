
//config/environments/developer.js

var nconf = require('nconf');
nconf.set('url', 'https://google.com');

nconf.set('database', {
  user: 'username',
  password: 'password',
  server: 'url'
});
