const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./data')
app.use(express.json())
app.use(cors())

const PORT = 8080


app.post('/signUp' , (req,res)=>{
    try {
        const {uName , fName , lName , faculty , courseCount, password } = req.body
        const courses = req.body.courses
        const sections = req.body.sections
        // should use md5 on the password at this stage
        console.log(uName , fName , lName , faculty , password , courseCount ,  courses , sections)
        res.json(req.body)
        // all parts of user are saved above ^^ just needs to be sent into database
    } catch (error) {
        console.log(error.message)
    }
})
app.get('/' , (req,res)=>{
    console.log('hi')
    res.send('hi')
})

app.listen(PORT , ()=>{
    console.log(`app is listening on ${PORT}`);
})