var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema(
{
    id: {type: Number, unique: true},
    status: String,
    priority: String,
    date: String,
    description: String
}, { _id : false });


//create mongo schema (table)
var employeeSchema = new mongoose.Schema({
 id: Number,
 guid: String,
 firstname: String,
 lastname: String,
 username: String,
 password: String,
 todo: [todoSchema],
 messages: { id: Number, contact: {firstname: String, 
                                    lastname: String, 
                                    university: {
                                        id: String, 
                                        name: String, 
                                        address: String, 
                                        city: String, 
                                        state: String, 
                                        zip: String, 
                                        website: String, 
                                        latitude: Number, 
                                        longitude: Number
                                    }
        }, 
        date: String, 
        category: String, 
        content: String 
 },
 
 books: { id: Number, isbn10: String, isbn13: Number, title: String, category: String}
});

//compile the schema into a model
var Employee = mongoose.model('Employee',employeeSchema);
var Todo = mongoose.model('Todo', todoSchema);


module.exports = function(app)
{
// -----API ROUTES--------
//find all employees
app.get('/api/employees', function(req, resp){
    Employee.find({}, function(err, data) {
    if (err)
    {
        console.log('error finding all employees');
        resp.json({ message: 'Unable to connect to employees' });
    }
    else
    {
        //return found data as json back to request
        resp.json(data);
    }
    });   
});


//find employee by id
app.get('/api/employees/:username', function(req, resp)
{
    Employee.findOne({username: req.params.username }, function(err, data)
    {
    if (err)
    {
        console.log('error finding employee by username');
        resp.json({ message: 'Unable to find employee by username' });
    }
    else
    {
        //return found data as json back to request
        resp.json(data);
    }
    }); 
});

}