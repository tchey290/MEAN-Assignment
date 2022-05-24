var mongoose = require('mongoose');

//get the employee schema
var Employee = mongoose.model('Employee');

module.exports = function(app)
{
    //gets the messages list for the current user or status false if not logged in
    app.get('/api/messages', function(req, res)
    {
        if (!req.isAuthenticated())
        {
            res.status(200).json(
            {
                status: false,
                message: 'Not currently logged in'
            });
        }
        else
        {
            Employee.findOne({id: req.user.id}).select('messages').exec(function(err, data)
            {
                if (err)
                {
                    res.json(
                    {
                        message: err
                    });
                }
                else
                {
                    res.json(data['messages']);
                }
            }); 
        }
    });
    
    //DOES NOT WORK
    // app.get('/api/messages/:id', function(req, res)
    // {
    //     if (!req.isAuthenticated())
    //     {
    //         res.status(200).json(
    //         {
    //             status: false,
    //             message: 'Not currently logged in'
    //         });
    //     }
    //     else
    //     {
    //         //db.employees.findOne({id:1,messages:{$elemMatch: {id:2}}}, {messages:1, _id:0})
    //         Employee.findOne({id: req.user.id}, {messages:1,_id:0}, function(err, data) {
    //             if (err)
    //             {
    //                 console.log('error finding message by id');
    //                  res.json({ message: 'Unable to find message by id' });
    //             }
    //             else
    //             {
    //                 //return found data as json back to request
    //                 res.json(data.messages);
    //                 console.log(data.messages);
    //             }
    //         }); 
    //     }
    // });
}