module.exports = function(app, passport)
{
    app.post('/api/login', function(req, res, next)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if (err)
            {
                return next(err);
            }
            if (!user)
            {
                return res.status(401).json({status: 'Login failed!', success: false});
            }
            req.logIn(user, function(err)
            {
                if (err)
                {
                    return res.status(500).json({status: 'Login failed!', success: false});
                }
                res.status(200).json({status: 'Login successful!', success: true});
            });
        })(req, res, next);
    });
    
    app.get('/api/logout', function(req, res, $location)
    {
        req.logout();
        res.status(200).json({
            status: 'User Logged Out!'
        });
    });
    
    app.get('/api/login/status', function(req, res)
    {
        if (!req.isAuthenticated())
        {
            return res.status(200).json(
            {
                status: false
            });
        }
        res.status(200).json(
        {
            status: true,
            userData: req.user
        });
    });
}