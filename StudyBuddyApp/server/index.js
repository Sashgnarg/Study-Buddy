const express = require('express')
const app = express()
const cors = require('cors')
const { Pool } = require('pg');
var md5 = require('md5');

var port = process.env.PORT || 8080

const pool = new Pool({
    user: "postgres",
    password: "cmpt372",
    host: "34.145.35.44",
    database: "postgres"
})

app.use(express.json())
app.use(cors())

const PORT = 8080

// For logging incoming requests
app.use('/', function (req, res, next) {
    console.log(req.method, 'request: ', req.url, JSON.stringify(req.body))
    next()
})

app.post('/signUp', (req, res) => {
    try {
        const { uName, fName, lName, faculty, courseCount, password } = req.body
        const courses = req.body.courses
        const sections = req.body.sections
        // should use md5 on the password at this stage
        console.log(uName, fName, lName, faculty, password, courseCount, courses, sections)
        res.json(req.body)
        // all parts of user are saved above ^^ just needs to be sent into database
    } catch (error) {
        console.log(error.message)
    }
})
app.get('/', (req, res) => {
    console.log('hi')
    res.send('hi')
})

app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
})

app.get('/get-faculties', async (req, res) => {
    try {
        var result = await pool.query(`
            SELECT * FROM faculty ORDER BY faculty_name;
        `)
        console.log(`sending back:`, result.rows)
        res.send(result.rows)
        res.end()
    } catch (e) {
        console.log(e)
    }
})

app.post('/add-faculty', async (req, res) => {
    queryWithId = `
    INSERT INTO faculty (faculty_id, faculty_name) VALUES ($1, $2);
    `
    queryWithoutId = `
    INSERT INTO faculty (faculty_name) VALUES ($1);
    `
    console.log(req.body)
    try {
        if (req.body.faculty_id == 0) {
            await pool.query(queryWithoutId, [req.body.faculty_name])
        }
        else {
            await pool.query(queryWithId, [req.body.faculty_id, req.body.faculty_name])
        }
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.delete('/delete-faculty', async (req, res) => {
    query = `
    DELETE FROM faculty WHERE faculty_id=$1
    `
    try {
        await pool.query(query, [req.body.faculty_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.patch('/edit-faculty', async (req, res) => {
    query = `
    UPDATE faculty
    SET faculty_name = $1
    WHERE faculty_id = $2;
    `
    try {
        await pool.query(query, [req.body.new_faculty_name, req.body.faculty_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/get-students', async (req, res) => {
    query = `
    SELECT * FROM student ORDER BY student_id
    `
    try {
        var result = await pool.query(query)
        console.log(`sending back:`, result.rows)
        res.send(result.rows)
        res.end()
    } catch (e) {
        console.log(e)
    }
})

app.post('/add-student', async (req, res) => {
    queryWithId = `
    INSERT INTO student (student_id, username, first_name, last_name, password, faculty_id, bio, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
    queryWithoutId = `
    INSERT INTO student (username, first_name, last_name, password, faculty_id, bio, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    if (req.body.student_id != null) {
        try {
            await pool.query(queryWithId,
                [
                    req.body.student_id,
                    req.body.username,
                    req.body.first_name,
                    req.body.last_name,
                    md5(req.body.password),
                    req.body.faculty_id,
                    req.body.bio,
                    req.body.is_admin
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await pool.query(queryWithoutId,
                [
                    req.body.username,
                    req.body.first_name,
                    req.body.last_name,
                    md5(req.body.password),
                    req.body.faculty_id,
                    req.body.bio,
                    req.body.is_admin
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
})

app.delete('/delete-student', async (req, res) => {
    query = `
    DELETE FROM student
    WHERE student_id = $1
    `
    try {
        console.log(req.body.student_id)
        await pool.query(query, [req.body.student_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.patch('/edit-student', async (req, res) => {
    query = `
    UPDATE student
    SET username = $1, first_name = $2, last_name = $3, password = $4, faculty_id = $5, bio = $6, is_admin = $7
    WHERE student_id = $8;
    `
    queryNoPassword = `
    UPDATE student
    SET username = $1, first_name = $2, last_name = $3, faculty_id = $4, bio = $5, is_admin = $6
    WHERE student_id = $7;
    `
    if (req.body.new_password != '') {
        try {
            await pool.query(query, [req.body.new_username, req.body.new_first_name, req.body.new_last_name, md5(req.body.new_password), req.body.new_faculty_id, req.body.new_bio, req.body.new_is_admin, req.body.student_id])
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await pool.query(queryNoPassword, [req.body.new_username, req.body.new_first_name, req.body.new_last_name, req.body.new_faculty_id, req.body.new_bio, req.body.new_is_admin, req.body.student_id])
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }

})

app.get('/get-departments', async (req, res) => {
    query = `
    SELECT * FROM department ORDER BY faculty_id, department_id
    `
    try {
        var result = await pool.query(query)
        console.log(`sending back:`, result.rows)
        res.send(result.rows)
        res.end()
    } catch (e) {
        console.log(e)
    }
})

app.post('/add-department', async (req, res) => {
    queryWithId = `
    INSERT INTO department (faculty_id, department_id, department_name)
    VALUES ($1, $2, $3)
    `
    queryWithoutId = `
    INSERT INTO department (faculty_id, department_name)
    VALUES ($1, $2)
    `
    if (req.body.department_id != null) {
        try {
            await pool.query(queryWithId,
                [
                    req.body.faculty_id,
                    req.body.department_id,
                    req.body.department_name,
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await pool.query(queryWithoutId,
                [
                    req.body.faculty_id,
                    req.body.department_name,
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
})

app.delete('/delete-department', async (req, res) => {
    query = `
    DELETE FROM department
    WHERE faculty_id = $1 AND department_id = $2
    `
    try {
        console.log(req.body.student_id)
        await pool.query(query, [req.body.faculty_id, req.body.department_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.patch('/edit-department', async (req, res) => {
    query = `
    UPDATE department
    SET department_name = $1
    WHERE faculty_id = $2 AND department_id = $3;
    `
    try {
        await pool.query(query, [req.body.new_department_name, req.body.faculty_id, req.body.department_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/get-courses', async (req, res) => {
    query = `
    SELECT * FROM course ORDER BY code
    `
    try {
        var result = await pool.query(query)
        console.log(`sending back:`, result.rows)
        res.send(result.rows)
        res.end()
    } catch (e) {
        console.log(e)
    }
})

app.post('/add-course', async (req, res) => {
    queryWithId = `
    INSERT INTO course (course_id, code, term, section, name, faculty_id, department_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    `
    queryWithoutId = `
    INSERT INTO course (code, term, section, name, faculty_id, department_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    `
    if (req.body.course_id != 0) {
        try {
            await pool.query(queryWithId,
                [
                    req.body.course_id,
                    req.body.code,
                    req.body.term,
                    req.body.section,
                    req.body.name,
                    req.body.faculty_id,
                    req.body.department_id
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await pool.query(queryWithoutId,
                [
                    req.body.code,
                    req.body.term,
                    req.body.section,
                    req.body.name,
                    req.body.faculty_id,
                    req.body.department_id
                ]
            )
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
})

app.delete('/delete-course', async (req, res) => {
    query = `
    DELETE FROM course
    WHERE course_id = $1
    `
    try {
        await pool.query(query, [req.body.course_id])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})

app.patch('/edit-course', async (req, res) => {
    query = `
    UPDATE course
    SET code = $1, term = $2, section = $3, name = $4, faculty_id = $5, department_id = $6
    WHERE course_id = $8;
    `
    try {
        await pool.query(query, [
            req.body.new_code,
            req.body.new_term,
            req.body.new_section,
            req.body.new_name,
            req.body.new_faculty_id,
            req.body.new_department_id,
            req.body.course_id,
        ])
        res.end()
    }
    catch (e) {
        console.log(e)
    }
})