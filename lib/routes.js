//routes
module.exports = function routes(app) {
    app.get('/',
    function(req, res) {
		//if user exists..
		if(req.session.user) {
			res.render('loggedin', {user: req.session.user});
		} else {
	        res.render('index');			
		}
    });
	
	//if we post w/ a username, render loggedin page
    app.post('/', authenticate,
    function(req, res) {
		//Dev notes: Dont render loggedin page here itself.. 
		//coz, if the user hits refresh, browser will ask do you want to post?	
		//PS: I am not using different path like /login because socket.io 
		//is not working on anything other than /
        res.redirect('/');
    });

    app.get('/logout', 
    function(req, res) {
		req.session.user = null;
		res.redirect('/');
    });
}

//helper function that checks if user has 
function authenticate(req, res, next) {
	if(!req.session || !req.body.user) {
		res.redirect('/');
		return;
	}
	if(req.body.user) {
		req.session.user = req.body.user;//save user in the session
	}
	next();//continue 
}

