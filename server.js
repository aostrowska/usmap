// set up ========================
    var express  = require('express');
    var app = express();                               // create our app w/ express
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // routes ======================================================================
        // api ---------------------------------------------------------------------

        // login to Jira
        app.post('/api/login', function(req, res){
            var Client = require('node-rest-client').Client;
            client = new Client();
            // Provide user credentials, which will be used to log in to JIRA.
            var loginArgs = {
                    data: {
                            "username": req.body.username,
                            "password": req.body.password
                    },
                    headers: {
                            "Content-Type": "application/json"
                    }
            };
            client.post("https://xsolve.atlassian.net/rest/auth/1/session", loginArgs, function(data, response){
                    if (response.statusCode == 200) {
                            console.log('succesfully logged in, session:', data.session);
                            var session = data.session;
                            // Get the session information and store it in a cookie in the header
                            var searchArgs = {
                                    headers: {
            								// Set the cookie from the session information
                                            cookie: session.name + '=' + session.value,
                                            "Content-Type": "application/json"
                                    },
                                    data: {
            								//Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                                            "jql": "project=EZY",
                                            "startAt": 0,
                                            "maxResults": 15,
                                            "fields": [
                                                "summary",
                                                "status",
                                                "assignee"
                                            ],
                                            "fieldsByKeys": false
                                    }
                            };
            				//Make the request return the search results, passing the header information including the cookie.

                            //POST that doesn't work

                            // client.post("https://xsolve.atlassian.net/rest/api/2/search", searchArgs, function(searchResult, response) {
                            //         console.log('status code:', response.statusCode);
                            //         console.log('search result:', searchResult);
                            // });

                            var getRequestArgs = {
                                    headers: {
            								// Set the cookie from the session information
                                            cookie: session.name + '=' + session.value
                                    }
                            };
                            console.log('cookie:', session.name + '=' + session.value);
                            client.get("https://xsolve.atlassian.net/rest/auth/1/session", getRequestArgs, function(sessionData, response) {
                                    console.log('status code:', response.statusCode);
                                    console.log('our session details:', sessionData);
                                    res.send('status code:' + response.statusCode)
                            });
                    }
                    else {
                        console.log("Login failed");
                    }
            });


        });

        // application -------------------------------------------------------------
        app.get('*', function() {
            res.sendfile('.public/index.html'); // load the single view file (angular will handle the page changes on the front-end
        });

        // listen (start app with node server.js) ======================================
        var port = 4000;
        app.listen(port);
        console.log("App listening on port " + port);
