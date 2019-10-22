process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require("body-parser");
var path = require('path');
var restify = require('restify');
var express = require('express');

// Read config file
const NODE_ENV = process.env.NODE_ENV;
switch (NODE_ENV) {
  case 'PROD':
    configBuffer = fs.readFileSync(path.resolve(__dirname + "/config", 'prod.json'), 'utf-8');
    break;
  case 'STG':
    configBuffer = fs.readFileSync(path.resolve(__dirname + "/config", 'stg.json'), 'utf-8');
    break;
  case 'UAT':
    configBuffer = fs.readFileSync(path.resolve(__dirname + "/config", 'uat.json'), 'utf-8');
    break;    
  default:
    configBuffer = fs.readFileSync(path.resolve(__dirname + "/config", 'dev.json'), 'utf-8');
}

let config = JSON.parse(configBuffer);
var client = restify.createJsonClient({
  url: config.coinetion_ws.path,
  version: '*',
  rejectUnauthorized: false
});

var oAuthClient = restify.createJsonClient({
  url: config.oauth.internal_url,
  version: '*',
  rejectUnauthorized: false
});


var app = express();

// var token = require('crypto').randomBytes(64).toString('hex');
// app.use(session({ secret: token }));
// API related Settings
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/',express.static(__dirname+'/../client/dist'));

var sess;
// Warraped APIs
// OAuth
const credentialsPub = {
    client: {
        id: 'customer_portal_ui',
        secret: '123123'
    },
    auth: {
        tokenHost: config.oauth.public_url,
        tokenPath: '/oauth-server/oauth/token',
        authorizePath: '/oauth-server/oauth/authorize',
        revokePath: '/oauth-server/oauth/revoke'
    }
};

const credentialsInt = {
    client: {
        id: 'customer_portal_ui',
        secret: '123123'
    },
    auth: {
        tokenHost: config.oauth.internal_url,
        tokenPath: '/oauth-server/oauth/token',
        authorizePath: '/oauth-server/oauth/authorize',
        revokePath: '/oauth-server/oauth/revoke'
    }
};

const oauth2Pub = require('simple-oauth2').create(credentialsPub);
const oauth2Int = require('simple-oauth2').create(credentialsInt);
const authorizationUri = oauth2Pub.authorizationCode.authorizeURL({
    redirect_uri: config.server.domain_name, // Back to portal
    scope: '',
});

app.get('/api/oauth', function (request, response) {
    response.send(JSON.stringify({ authorizationUri }));
});

app.get('/api/oauth/logout', function (request, response) {
		var logoutUrl = config.oauth.public_url + '/oauth-server/logout';
    response.send(JSON.stringify({ logoutUrl }));
});


app.post('/api/oauth/token', function (request, response) {
	  const tokenConfig = {
        redirect_uri: config.server.domain_name,
        code: request.body.code
    };
		oauth2Int.authorizationCode.getToken(tokenConfig).then((result) => {
		    const token = oauth2Int.accessToken.create(result);
		    response.send(token.token);
	  }).catch((error) => {
			response.status(error.status);
			response.send(error.context.error_description);
  	});;
});

app.post('/api/oauth/token/refresh', function (request, response) {
		var clientKey = new Buffer(credentialsInt.client.id + ':' + credentialsInt.client.secret).toString('base64');
		var options = { 
				method: 'POST',
			  headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + clientKey },
			  path: '/oauth-server/oauth/token?grant_type=refresh_token&refresh_token=' + request.body.refreshToken,
			  json: true 
		};
		oAuthClient.post(options, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 
});

// Users
app.post('/api/me', function(request, response) {
		var options = {
			path: '/api/v1/me',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};		
		client.get(options, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/update', function(request, response) {
		var options = {
			path: '/api/v1/me',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};		
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/password/reset', function(request, response) {
		var options = {
			path: '/api/v1/me/password/reset',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};		
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

// Channels
app.post('/api/me/channels/find', function(request, response) {
		var options = {
			path: '/api/v1/me/channels/find',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/channels', function(request, response) {
		var options = {
			path: '/api/v1/me/channels',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};		
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/channels/:channelUid/withdraw', function(request, response) {
		var options = {
			path: '/api/v1/me/channels/' + request.params.channelUid + '/withdraw',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				console.log(err);
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/channels/:channelUid', function(request, response) {
		var options = {
			path: '/api/v1/me/channels/' + request.params.channelUid,
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};	
		client.get(options, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

// Transaction
app.post('/api/me/transactions/find', function(request, response) {
		var options = {
			path: '/api/v1/me/transactions/find',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});


// Payments
app.post('/api/me/payments/find', function(request, response) {
		var options = {
			path: '/api/v1/me/payments/find',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.post('/api/me/payments/:paymentId', function(request, response) {
		var options = {
			path: '/api/v1/me/payments/' + request.params.paymentId,
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.get(options, function(err, req, res, obj) {
			if(err) {
				console.log(err);
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});


app.post('/api/me/payments/:paymentId/confirm', function(request, response) {
		var options = {
			path: '/api/v1/me/payments/' + request.params.paymentId + '/confirm',
		  headers: {
		    Authorization: 'Bearer ' + request.body.accessToken
		  }
		};
		client.post(options, request.body, function(err, req, res, obj) {
			if(err) {
				if (err.statusCode >= 100 && err.statusCode < 600) {
				  response.status(err.statusCode);
				} else {
				  response.status(500);			
				}
				response.send(err.body);
			} else {
			  response.send(JSON.parse(res.body));
			}
		}); 	
});

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname+'/../client/dist','index.html'))
});

app.use(function(req, res, next) {
	var err = new Error('Page Not Found');
	err.status = 404;
	next(err);
});


if(NODE_ENV == 'STG') {
	// SSL certs
	var privateKey  = fs.readFileSync('cert/www.coinetion.com.key', 'utf8');
	var certificate = fs.readFileSync('cert/www.coinetion.com.crt', 'utf8');

	var https_options = {
	    key: privateKey,
	    cert: certificate
	};

	var server = https.createServer(https_options, app).listen(443, function(){
	    console.log('Coinetion customer portal listening on port 443!');
	});
} else {
		app.listen(80, function () {
			console.log('Coinetion customer portal listening on port 80!');
		});
}

module.exports = app; 