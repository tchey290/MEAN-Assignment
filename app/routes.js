var mongoose = require('mongoose');

module.exports = function(app)
{
    // -----FRONT END ROUTES------
    var path = require('path');
    //home page route - should go to login
    app.get('/', function(req, res)
        {
            var file = path.join(__dirname, '../public', 'index.html')
            res.sendFile(file);
        });
}