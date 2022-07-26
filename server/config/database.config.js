const mongoose = require('mongoose')
// mongoose is a singleton, so connecting to db once is enough
mongoose.connect('mongodb://127.0.0.1/chaty', { useNewUrlParser: true })
.then(()=>{console.log('connection to database established')})
.catch((e) => {
    console.log('Could not established connection with server')
    console.log(e)
})