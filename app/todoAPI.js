var mongoose = require('mongoose');

//get the employee schema
var Employee = mongoose.model('Employee');

module.exports = function(app)
{
    //gets the todo list for the current user or status false if not logged in
    app.get('/api/todo', function(req, res)
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
            Employee.findOne({id: req.user.id}).select('todo').exec(function(err, data)
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
                    res.json(data['todo']);
                }
            }); 
        }
    });
    
    //will remove the provided TODO ID from the currently logged in user
    app.get('/api/todo/remove/:id', function(req, res)
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
            Employee.findOneAndUpdate({id: req.user.id}, {$pull: {todo: {id: req.params.id}}}, function(err, data)
            { //BUG: DOES NOT UPDATE TODO IDS TO START FROM ONE  db.employees.find({id: 5, "todo.id": 2}, {todo:1, _id:0})
                if(err)
                {
                    res.json({ success: false });
                }
                else
                {
                    Employee.findById(req.user._id, function (err, employee) { //updates todo ids so that they remain sequential
                        for(var i=0; i<employee.todo.length; i++) {
                            var newIndex = i + 1;
                            employee.todo[i].id = newIndex;
                        }
                         employee.save(function (err) {
                            //console.log('successfully updated list');
                        });
                    });
                    
                    res.json({ success: true });
                }
            });
        }
    });
    
    //add something to the to do list
    app.post('/api/todo/add', function(req, res)
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
        Employee.findById(req.user._id, function (err, employee)
        {
            if(err)
            {
                return res.json({ error: err});
            }
            
            var nextIndex = employee.todo[employee.todo.length-1].id + 1;
			var todoItem = {
                id: nextIndex,
                status: req.body.status,
                priority: req.body.priority,
                date: req.body.date,
                description: req.body.description
            };
            employee.todo.push(todoItem);
            
			/*
            for(var i=0; i<employee.todo.length; i++) {
                var newIndex = i + 1;
                employee.todo[i].id = newIndex;
            }
			*/
            
            employee.save(function(err)
            {
                if(err)
                {
                    res.json({ save: err});
                }
                else
                {
                    res.json({ status: 'done'});
                }
            });
        });
        }
    });
    
    //edit a task
    app.post('/api/todo/edit/:id', function(req, res)
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
            Employee.findById(req.user._id, function (err, employee)
            {
               //employee.todo.edit etc
               var update = " " + req.body.description;
               employee.todo[req.params.id-1].description = update;
               
                employee.save(function(err)
                {
                    if(err)
                    {
                        res.json({ save: err});
                    }
                    else
                    {
                        res.json({ status: 'done'});
                    }
                });
            });
        }
    });
    
    app.get('/api/max', function(req, res)
    {
            Employee.findOne({id: 5}).select('todo.id').exec(function(err, data)
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
                    res.json(data['todo']);
                }
            }); 

    });
}