var mongoose = require('mongoose');
//create mongo schema (table)
var bookSchema = new mongoose.Schema({
 id: Number,
 isbn10: String,
 isbn13: String,
 title: String,
 year: String,
 publisher: String,
 production: { status: String, binding: String, size: String, pages: String, instock: String },
 category: { main: String, secondary: String}
});

//compile the schema into a model
var Book = mongoose.model('Book',bookSchema);

module.exports = function(app)
{
     // -----API ROUTES---------
    //get all books
    app.get('/api/books', function(req, resp){
        Book.find({}, function(err, data) {
        if (err)
        {
            console.log('error finding all books');
            resp.json({ message: 'Unable to connect to books' });
        }
        else
        {
            //return found data as json back to request
            resp.json(data);
        }
        });   
    });

    //get book with specified id
    app.get('/api/books/:isbn10', function(req, resp)
    {
     Book.find({isbn10: req.params.isbn10 }, function(err, data)
     {
        if (err)
        {
            console.log('error finding book by isbn 10');
             resp.json({ message: 'Unable to find book by isbn 10' });
        }
        else
        {
            //return found data as json back to request
            resp.json(data);
        }
        }); 
        
    });
    
    //get book with specified id
    app.get('/api/books/id/:id', function(req, resp)
    {
     Book.find({id: req.params.id }, function(err, data)
     {
        if (err)
        {
            console.log('error finding book by id');
             resp.json({ message: 'Unable to find book by id' });
        }
        else
        {
            //return found data as json back to request
            resp.json(data);
        }
        }); 
        
    });
}