const express = require('express')
const app = express()

const {pool} = require('pg')
app.use(express.json())

const PORT = 8080


app.post('/signUp' , (req,res)=>{
    try {
        const {uName , fName , lName , faculty , password , repeatPassword } = req.body
        const courses = req.body.courses
        console.log(body)
        res.json(body)
        // logic isnt implemented yet
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