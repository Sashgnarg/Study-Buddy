const express = require('express')
const cors = require('cors')
const { Pool } = require('pg');
const md5 = require('md5');
const axios = require('axios');
const path = require('path');
const app = express().use('*', cors());
const server = require('http').Server(app);
const io = require('socket.io')(server);

const pool = new Pool({
    user: "postgres",
    password: "cmpt372",
    host: "34.145.35.44",
    database: "postgres"
})

app.use(express.json())
app.use(cors())
//app.use(express.static(__dirname + "/study-buddy-app"))


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Access-Control-Allow-Headers, Content-Type, Authorization, Origin, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true)
    next();
});


//app.use(express.static(__dirname + "/study-buddy-app"))

const PORT = 8081



io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('new_message', (message) => {
        console.log(`Received message: ${message}`);
        io.emit('new_message', message);
    });
});




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

server.listen(PORT, () => {
    console.log(`app and socket are listening on port ${PORT}`);
});

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

app.delete('/delete-department', async (req, res) => {
    query = `
    DELETE FROM department WHERE faculty_id=$1 AND department_id=$2
    `
    try {
        await pool.query(query, [req.body.faculty_id, req.body.department_id])
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
        //console.log(result)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
    }
})


app.get(`/get-usernames`, async (req, res) => {
    let query = `select username from student`

    try {
        let result = (await pool.query(query)).rows
        res.json(result)
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
            res.sendStatus(200)
            res.end()
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        try {
            await pool.query(queryNoPassword, [req.body.new_username, req.body.new_first_name, req.body.new_last_name, req.body.new_faculty_id, req.body.new_bio, req.body.new_is_admin, req.body.student_id])
            res.sendStatus(200)
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

app.post('/delete-enrollment', async (req, res) => {
    const query = `DELETE FROM enrollment WHERE student_id = $1 AND course_id = $2`;
    const selectquery =
        `
    SELECT student_id, enrollment.course_id, course.code, course.section, course.name
    FROM enrollment, course
    WHERE student_id = $1 AND enrollment.course_id = course.course_id
    ORDER BY course_id
    `

    try {
        const { student_id, course_id } = req.body
        console.log(student_id, course_id)
        await pool.query(query, [student_id, course_id]);
        var selectresult = await pool.query(selectquery, [student_id])
        res.send(selectresult.rows)
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

app.post('/login', async (req, res) => {
    let { username, password } = req.body
    password = md5(password)
    result = await pool.query("select * from student where lower(username) = lower($1) and password = $2", [username, password])
    if (result.rows.length > 0) {
        if (result.rows[0].is_admin == true) {
            res.json({ is_admin: true , username: result.rows[0].username})
        }
        else {
            console.log("returning true my brother")
            res.json({ is_admin: false , username: result.rows[0].username})
        }
    } else {
        console.log(result.rows[0])
        res.send(false)
    }
})

app.get('/get-common-courses/:username1/:username2', async (req, res) => {

    const query = `SELECT c.code
FROM course c
JOIN enrollment e ON c.course_id = e.course_id
JOIN student s ON e.student_id = s.student_id
WHERE s.username = $1

INTERSECT

SELECT c.code
FROM course c
JOIN enrollment e ON c.course_id = e.course_id
JOIN student s ON e.student_id = s.student_id
WHERE s.username = $2;
`
    const username1 = req.params.username1
    const username2 = req.params.username2

    try {
        let result = (await pool.query(query, [username1, username2])).rows
        //    console.log(result)
        res.json(result)
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
                                //console.log(allCourses)
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

app.get('/weather/', async (req, res) => {
    const API_KEY = 'b5f4498cdc5a7ac1855ca82a6b5e6f32';
    const city = "vancouver";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    try {
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting weather data');
    }
});

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
        (code, term, section, name, faculty_id, department_id)
        VALUES
        `
    sameCodeCourses.forEach(course => {
        let value =
            `
        ('${course.code}', '${course.term}', '${course.section}', '${course.name}', '${course.faculty_id}', '${course.department_id}'),
        `
        query += value
    })

    // Remove last comma from the query
    let lastCommaIndex = query.lastIndexOf(",");
    query = query.slice(0, lastCommaIndex) + query.slice(lastCommaIndex + 1);

    // Add semicolon to the end of the query
    query += `;`

    console.log(query)
    // !!!!!!!!! Havent tested this just yet !!!!!!!!!!!
    try {
        pool.query(query)
    } catch (error) {
        console.log(error)
    }
}

app.get('/messages', async (req, res) => {
    const sender_username = req.query.sender_username;
  
    if (!sender_username) {
        res.status(400).json({ message: 'sender username required' });
      return;
    }
  
    const query = `
      SELECT * FROM "message"
      WHERE"sender_username" = $1 OR "receiver_username" = $1
      ORDER BY "timestamp" ASC
    `;
    const dbRes = await pool.query(query, [sender_username]);
    const messages = dbRes.rows;
  
    res.json(messages);
  });

  app.post('/messages', async (req, res) => {
    const sender_username = req.body.sender_username;
    const receiver_username = req.body.receiver_username;
    const content = req.body.content;
    const timestamp = new Date();
  
    if (!sender_username || !receiver_username || !content) {
        res.status(400).json({ message: 'sender username, receiver username and content required' });
        return;
    }
  
    const query = `
      INSERT INTO "message" ("sender_username", "receiver_username", "content", "timestamp")
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [sender_username, receiver_username, content, timestamp]);
  
    res.status(201).json({ message: 'Message created' });
    console.log('Message created');
  });

app.get('/message-history/:sender_username/:receiver_username' , async(req, res)=>{
    const sender_username = req.params.sender_username
    const receiver_username = req.params.receiver_username
    const query =`select * from message where sender_username in ($1 , $2) and receiver_username in ($1 ,$2)`

    try {
        let result = await pool.query(query , [sender_username , receiver_username])
        console.log(result.rows)
        res.json(result.rows)
    } catch (error) {
        console.log(error)
    }
})


app.get('/most-compatible/:username', async (req, res) => {
    //let student_id = req.params.student_id;
    let username = req.params.username
    console.log('attempting to find most compatible')
    try {
        let student = await (await pool.query('select * from student where username = ($1)', [username])).rows[0]
        //console.log('here is the current student :', student)
        getCompatible(student, res);
    } catch (error) {
        console.log(error)
    }
})

app.get('/get-student-schedule/:student_id', async (req, res) => {
    let student_id = req.params.student_id
    query = `
    SELECT student_id, day_of_week, EXTRACT(HOUR FROM start_time) as start_hour, is_available
    FROM availability_block
    WHERE student_id = $1
    ORDER BY day_of_week, start_time
    `
    try {
        var result = await pool.query(query, [student_id])
        res.send(result.rows)
        res.end()
    } catch (error) {
        console.log(error)
        res.send(error)
        res.end()
    }
})

app.get('/get-student-courses/:student_id', async (req, res) => {
    let student_id = req.params.student_id
    query = `
    SELECT student_id, enrollment.course_id, course.code, course.section, course.name
    FROM enrollment, course
    WHERE student_id = $1 AND enrollment.course_id = course.course_id
    ORDER BY course_id
    `
    try {
        var result = await pool.query(query, [student_id])
        res.send(result.rows)
        res.end()
    } catch (error) {
        console.log(error)
        res.send(error)
        res.end()
    }
})

app.patch('/modify-schedule', async (req, res) => {
    // Create base query
    var query = `
    INSERT INTO availability_block
    (student_id , day_of_week, start_time, end_time, is_available)
    VALUES
    `

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

    query +=
        `
    ON CONFLICT (student_id , day_of_week, start_time, end_time)
    DO UPDATE SET
    (student_id , day_of_week, start_time, end_time, is_available)
    =
    (EXCLUDED.student_id , EXCLUDED.day_of_week, EXCLUDED.start_time, EXCLUDED.end_time, EXCLUDED.is_available)
    `

    // Add semicolon to the end of the query
    query += `;`
    // console.log(query)
    try {
        await pool.query(query);
        res.sendStatus(200)
        res.end()
    } catch (error) {
        console.log(error)
    }
})

async function getCompatible(student, res) {
    const getCourseCodeQuery = `SELECT course.code
    FROM course
    INNER JOIN enrollment ON course.course_id = enrollment.course_id
    WHERE enrollment.student_id = $1;`

    //const getAvailabilityQuery =`SELECT start_time , day_of_week FROM availability_block WHERE student_id = $1 AND is_available = true`
    const getAvailabilityCountQuery = `SELECT COUNT(*)
    FROM availability_block ab1 
    JOIN availability_block ab2 
    ON ab1.start_time = ab2.start_time 
       AND ab1.day_of_week = ab2.day_of_week 
       AND ab1.is_available = ab2.is_available 
    WHERE ab1.student_id = ${student.student_id} 
       AND ab2.student_id = $1
       AND ab1.is_available = true;
    `

    let myArray = []
    try {
        let allOtherStudents = (await pool.query('select student_id , faculty_id from student where student_id <> $1', [student.student_id])).rows
        let my_student_enrollments = (await pool.query(getCourseCodeQuery, [student.student_id])).rows

        compatibleArray(allOtherStudents, student, my_student_enrollments).then((array) => {
            array.sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            getStudentFromArray(array, res)
            //res.json(array)
        })
    } catch (error) {
        console.log(error)
    }
}

// pool.end(()=>{
//     console.log('ending pool')
// })

async function compatibleArray(allOtherStudents, student, my_student_enrollments) {
    const getCourseCodeQuery = `SELECT course.code
    FROM course
    INNER JOIN enrollment ON course.course_id = enrollment.course_id
    WHERE enrollment.student_id = $1;`

    const getAvailabilityCountQuery = `SELECT COUNT(*)
    FROM availability_block ab1 
    JOIN availability_block ab2 
    ON ab1.start_time = ab2.start_time 
       AND ab1.day_of_week = ab2.day_of_week 
       AND ab1.is_available = ab2.is_available 
    WHERE ab1.student_id = ${student.student_id} 
       AND ab2.student_id = $1
       AND ab1.is_available = true;
    `
    return new Promise((resolve, reject) => {
        let array = []
        allOtherStudents.forEach(async (otherStudent) => {
            let compatibilityScore = 0;
            if (student.faculty_id == otherStudent.faculty_id) {
                compatibilityScore += 5 // can change this scalar
            }
            let cur_student_enrollments = (await pool.query(getCourseCodeQuery, [otherStudent.student_id])).rows
            let overLappingCourseCount = my_student_enrollments.filter(myCourse => cur_student_enrollments.some(otherCourse => otherCourse.code === myCourse.code)).length;
            compatibilityScore += 7 * overLappingCourseCount // can change this scalar

            let overLappingAvailbilityCount = (await pool.query(getAvailabilityCountQuery, [otherStudent.student_id])).rows[0]
            compatibilityScore += overLappingAvailbilityCount.count * 0.1 // can change the scalars

            array.push({ student_id: otherStudent.student_id, compatibilityScore: compatibilityScore })
            if (array.length == allOtherStudents.length) {
                resolve(array)
            }
        })
        //console.log(array)
    })
}

async function getStudentFromArray(array, res) {
    studentArray = []
    await array.forEach(async (student, index) => {
        try {
            let result = (await pool.query('select * from student where student_id = $1', [student.student_id])).rows[0]
            //console.log(result)
            result['compatibilityPosition'] = index
            studentArray.push(result)
        } catch (error) {
            console.log(error)
        }
        if (studentArray.length == array.length) {
            studentArray.sort((a, b) => a.compatibilityPosition - b.compatibilityPosition);
            //console.log(studentArray)
            res.json(studentArray)

        }
    })
}   
