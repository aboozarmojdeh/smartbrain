const express = require('express');
const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'aboo',
            email: 'aboo@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'eli',
            email: 'eli@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
};

// Middlewares **********
app.use(express.json());

//********************* */
// app.use(express.urlencoded({extended: false}));
app.get('/', (req, res) => {
    res.send(`It's working`)
})

app.post('/signin', (req, res) => {

    if(req.body.email===database.users[0].email &&
        req.body.password===database.users[0].password){
            res.json('Success Sign in')
        }else {
            res.status(400).json('Error logging in')
        }
    // res.json(req.body)
});

app.post('/register', (req, res) => {
const {email,name,password}=req.body;
    database.users.push({
        id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
    })
    res.json(database.users)
});


app.listen(3000, () => {
    console.log('App listening to PORT 3000')
});



//////
// / --> res=it's working
// /signin --> POST =success/fail
// /register --> POST =user
// /profile/:id -->GET =user
// /image --> PUT --> =user


///////