const express = require('express')
const app = express()
const cors = require('cors')
const { Pool } = require('pg');
var md5 = require('md5');
const axios = require("axios");
const path = require('path');

const pool = new Pool({
    user: "postgres",
    password: "cmpt372",
    host: "34.145.35.44",
    database: "postgres"
})

app.use(express.json())
app.use(cors())
app.use(express.static(__dirname+"study-buddy-app"))

const PORT = 8081

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
    console.log(__dirname+ "/study-buddy-app/index.html")
    res.sendFile( path.join( __dirname, "/study-buddy-app/index.html"))
})
app.get('/runtime.7ca07cb080bd9ab7.js', (req, res) => {

    res.sendFile( path.join( __dirname, "/study-buddy-app/runtime.7ca07cb080bd9ab7.js"))
})

app.get('/polyfills.e73cf954a4397259.js', (req, res) => {

    res.sendFile( path.join( __dirname, "/study-buddy-app/polyfills.e73cf954a4397259.js"))
})

app.get('/main.b68a9d15b36edcdc.js', (req, res) => {

    res.sendFile( path.join( __dirname, "/study-buddy-app/main.b68a9d15b36edcdc.js"))
})


app.get('/styles.eea3ccb45d1dca3a.css', (req, res) => {

    res.sendFile( path.join( __dirname, "/study-buddy-app/styles.eea3ccb45d1dca3a.css"))
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

app.get('/get-student-by-id/:id', async (req, res) => {
    let id = req.params.id
    console.log(`you requested student with id : ${id}`)

    const query = `SELECT * FROM student WHERE student_id = $1`

    try {
        let res = (await pool.query(query, [id]))
        req.send(res.rows)
    } catch (error) {
        console.log(error)
    }
})

app.get('/get-student-by-username/:username', async (req, res) => {
    let username = req.params.username
    console.log(`you requested student with username: ${username}`)

    const query = `SELECT * FROM student WHERE username = $1`

    try {
        let result = await pool.query(query, [username])
        console.log(result)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
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
            let res = await pool.query(queryWithId,
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
            console.log(res)
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
})

app.get('/get-courses', async (req, res) => {
    query = `
    SELECT * FROM course ORDER BY code , section
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

app.get('/get-course-by-code-section/:code/:section', async (req, res) => {
    let code = req.params.code
    let section = req.params.section
    console.log(`you requested course with code:${code} and section: ${section}`)

    const query = `SELECT * FROM course WHERE code = $1 AND section =$2`

    try {
        let result = await pool.query(query, [code, section])
        res.send(result.rows)
    } catch (error) {
        console.log(error)
    }
})


app.post('/add-enrollment', async (req, res) => {
    const query = `INSERT INTO enrollment (student_id , course_id) VALUES ($1 , $2)`;

    try {
        const { student_id, course_id } = req.body
        console.log(student_id, course_id)
        pool.query(query, [student_id, course_id]);
        res.end()
    } catch (error) {
        console.log(error)

    }
})


app.post('/add-availability', async (req, res) => {
    // Create base query
    var query = `
    INSERT INTO availability_block
    (student_id , day_of_week, start_time, end_time, is_available)
    VALUES
    `

    // TODO: Get student_id from body
    var student_id = req.body.student_id
    var availability = req.body.availability
    // Add values to query
    for (let day = 0; day < availability.length; day++) {
        for (let hour = 0; hour < availability[0].length; hour++) {
            let is_available = availability[day][hour].is_available
            let start_time = availability[day][hour].start_time
            value =
                `
            (${student_id}, ${day}, to_timestamp('${start_time}:00', 'HH24:MI'), to_timestamp('${start_time + 1}:00', 'HH24:MI'), ${is_available}),
            `

            query += value
        }
    }

    // Remove last comma from the query
    var lastCommaIndex = query.lastIndexOf(",");
    query = query.slice(0, lastCommaIndex) + query.slice(lastCommaIndex + 1);

    // Add semicolon to the end of the query
    query += `;`
    // console.log(query)
    try {
        await pool.query(query);
        res.end()
    } catch (error) {
        console.log(error)
    }
})



app.get('/fill-database-courses', (req, res) => {
    axios.get("http://www.sfu.ca/bin/wcm/course-outlines?current/current").then(data => {
        let departments = data.data
        departments = departments.filter(elm => elm.text == "CMPT" || elm.text == "MACM"
            || elm.text == "STAT" || elm.text == "MATH"
        )
        departments.forEach(department => {
            //console.log(department.text)
            axios.get(`http://www.sfu.ca/bin/wcm/course-outlines?current/current/${department.text}`)
                .then(data => {
                    let courses = data.data
                    //console.log(courses)
                    courses.forEach(course => {
                        axios.get(`http://www.sfu.ca/bin/wcm/course-outlines?current/current/${department.text}/${course.text}`)
                            .then(data => {
                                let sections = data.data
                                let allCourses = [];
                                //console.log(sections)
                                sections.forEach(section => {
                                    allCourses.push({
                                        code: department.text + course.text, term: 'Spring 2023', section: section.text, name: section.title
                                        , faculty_id: getFacultyID(department.text), department_id: getDepartmentID(department.text)
                                    })
                                }) // end forEach for sections
                                console.log("here are all the sections of this course", allCourses)
                                // at this point, allCourses holds each course that share a course code
                                // push to database , prob similar method as availability
                                pushCoursesToDB(allCourses)

                            }).catch(error => {
                                console.log('error at ', department.text, course.text, ":", error)
                            })
                    })
                }).catch(error => {
                    console.log("error at ", department.text)
                })
        });
        //console.log(allCourses)
        res.end()
    }).catch(error => {
        console.log(error)
    })
})

function getFacultyID(departmentName) {
    switch (departmentName) {
        case "CMPT":
            return 1;
        case "MACM": // could go into science or applied science faculty
            return 8;
        case "STAT":
            return 8;
        case "MATH":
            return 8;
    }
}
function getDepartmentID(departmentName) {
    switch (departmentName) {
        case "CMPT":
            return 1;
        case "MACM": // could go into science or applied science faculty || currently in science
            return 12;
        case "STAT":
            return 11;
        case "MATH":
            return 10;
    }
}

function pushCoursesToDB(sameCodeCourses) {
    // base query
    var query = `
        INSERT INTO course
        (code , term, section, name, faculty_id , department_id)
        VALUES
        `
    sameCodeCourses.forEach(course => {
        let value =
            `
        (${course.code}, ${course.term}, ${course.section}, ${course.name}, ${course.faculty_id} , ${course.department_id}),
        `
        query += value
    })

    // Remove last comma from the query
    let lastCommaIndex = query.lastIndexOf(",");
    query = query.slice(0, lastCommaIndex) + query.slice(lastCommaIndex + 1);

    // Add semicolon to the end of the query
    query += `;`

    console.log(query)

    // try {
    //     pool.query(query)
    // } catch (error) {
    //     console.log(error)
    // }
}
