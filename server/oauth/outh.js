const credentials = {
    client: {
        id: '9ad25a966bf9df765e1f1a4643f270929ea0e8a5ce0735d480afa4411616490e21aa502fe97c04a0ff95b2501ae6beb2d2429365dc30dc2595442d48b37a5fb6',
        secret: '123123'
    },
    auth: {
        tokenHost: 'http://oauth-bc15.xenzex.local:8080',
        tokenPath: '/oauth-server/oauth/token',
        authorizePath: '/oauth-server/oauth/authorize',
        revokePath: '/oauth-server/oauth/revoke'
    }
};

const oauth2 = require('simple-oauth2').create(credentials);

exports.simpleOauth = function() {
  return oauth2;
}