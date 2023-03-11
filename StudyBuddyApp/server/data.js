const { Pool } = require('pg');

var port = process.env.PORT || 8080

const pool = new Pool({
    user: "postgres",
    password: "cmpt372",
    host: "34.145.35.44",
    database: "postgres"
})

// SQL FUNCTIONS

// Create all tables in database
async function createAllTables() {
    var query = `
        BEGIN;
        CREATE TABLE "student" (
            "student_id" serial PRIMARY KEY,
            "username" varchar(20) UNIQUE,
            "first_name" varchar(35) NOT NULL,
            "last_name" varchar(35) NOT NULL,
            "password" uuid NOT NULL,
            "faculty_id" integer,
            "bio" varchar(255),
            "is_admin" boolean DEFAULT false
        );

        CREATE TABLE "course" (
            "course_id" serial PRIMARY KEY,
            "code" varchar(10) NOT NULL,
            "term" varchar(11) NOT NULL,
            "section" char(4) NOT NULL,
            "name" varchar(60) NOT NULL,
            "faculty_id" integer NOT NULL,
            "department_id" integer NOT NULL
        );

        CREATE TABLE "faculty" (
            "faculty_id" serial PRIMARY KEY,
            "faculty_name" varchar(35) NOT NULL
        );

        CREATE TABLE "department" (
            "faculty_id" integer,
            "department_id" serial NOT NULL,
            "department_name" varchar(35) NOT NULL,
            PRIMARY KEY ("faculty_id", "department_id")
        );

        CREATE TABLE "enrollment" (
            "student_id" integer,
            "course_id" integer,
            PRIMARY KEY ("student_id", "course_id")
        );

        CREATE TABLE "availability_block" (
            "student_id" integer,
            "day_of_week" smallint NOT NULL,
            "start_time" timestamp NOT NULL,
            "end_time" timestamp NOT NULL,
            "is_available" boolean NOT NULL,
            PRIMARY KEY ("student_id", "day_of_week", "start_time", "end_time")
        );

        CREATE TABLE "course_schedule_block" (
            "course_id" integer,
            "day_of_week" smallint NOT NULL,
            "start_time" timestamp NOT NULL,
            "end_time" timestamp NOT NULL,
            PRIMARY KEY ("course_id", "day_of_week", "start_time", "end_time")
        );

        CREATE INDEX ON "student" ("username");

        CREATE UNIQUE INDEX ON "course" ("code", "term", "section");

        ALTER TABLE "student" ADD FOREIGN KEY ("faculty_id") REFERENCES "faculty" ("faculty_id");

        ALTER TABLE "department" ADD FOREIGN KEY ("faculty_id") REFERENCES "faculty" ("faculty_id");

        ALTER TABLE "enrollment" ADD FOREIGN KEY ("student_id") REFERENCES "student" ("student_id");

        ALTER TABLE "enrollment" ADD FOREIGN KEY ("course_id") REFERENCES "course" ("course_id");

        ALTER TABLE "availability_block" ADD FOREIGN KEY ("student_id") REFERENCES "student" ("student_id");

        ALTER TABLE "course_schedule_block" ADD FOREIGN KEY ("course_id") REFERENCES "course" ("course_id");

        ALTER TABLE "course" ADD FOREIGN KEY ("faculty_id", "department_id") REFERENCES "department" ("faculty_id", "department_id");

        COMMIT;
    `
    try {
        await pool.query(query)
    }
    catch (e) {
        console.log(e)
    }

}

async function selectQuery() {
    try {
        var myquery = await pool.query(`

            SELECT * FROM course

        `)
        console.log(myquery.rows)
        pool.end()
        // process.exit()
    }
    catch (e) {
        console.log("Error: ", e)
    }
}

async function insertFaculties() {
    var query = `
        BEGIN;
        INSERT INTO faculty (faculty_name) VALUES ('Applied Science');
        INSERT INTO faculty (faculty_name) VALUES ('Arts and Social Science');
        INSERT INTO faculty (faculty_name) VALUES ('Communication Art and Technology');
        INSERT INTO faculty (faculty_name) VALUES ('Business');
        INSERT INTO faculty (faculty_name) VALUES ('Education');
        INSERT INTO faculty (faculty_name) VALUES ('Environment');
        INSERT INTO faculty (faculty_name) VALUES ('Health Science');
        INSERT INTO faculty (faculty_name) VALUES ('Science');
        COMMIT;
    `
    try {
        await pool.query(query)
        pool.end()
    }
    catch (e) {
        console.log(e)
    }
}

async function insertDepartments() {
    var query = `
        BEGIN;
        INSERT INTO department (faculty_id, department_name) VALUES (1, 'Computing Science');
        INSERT INTO department (faculty_id, department_name) VALUES (1, 'Engineering Science');
        INSERT INTO department (faculty_id, department_name) VALUES (1, 'Mechatronics Systems Engineering');
        INSERT INTO department (faculty_id, department_name) VALUES (1, 'Sustainable Energy Engineering');
        INSERT INTO department (faculty_id, department_name) VALUES (2, 'Anthropology');
        INSERT INTO department (faculty_id, department_name) VALUES (2, 'Behavioural Neuroscience');
        INSERT INTO department (faculty_id, department_name) VALUES (2, 'Cognitive Science');
        INSERT INTO department (faculty_id, department_name) VALUES (2, 'Criminology');
        COMMIT;
    `
    try {
        await pool.query(query)
        pool.end()
    }
    catch (e) {
        console.log(e)
    }
}

async function insertAdminUser() {
    var query = `
        DELETE FROM student WHERE username='admin';
        INSERT INTO student (username, first_name, last_name, password, faculty_id, bio, is_admin) VALUES ('admin', 'Admin', 'User', '21232f297a57a5a743894a0e4a801fc3', 1, 'This is the admin account created by default', true);
    `
    try {
        await pool.query(query)
        pool.end()
    }
    catch (e) {
        console.log(e)
    }
}

async function insertCourses() {
    var query = `
        INSERT INTO course (code, term, section, name, faculty_id, department_id) VALUES ('CMPT372', 'Spring 2023', 'D100', 'Web II - Server-side Development', 1, 1);
        INSERT INTO course (code, term, section, name, faculty_id, department_id) VALUES ('CMPT376W', 'Spring 2023', 'D200', 'Technical Writing and Group Dynamics', 1, 1);
    `
    try {
        await pool.query(query)
        pool.end()
    }
    catch (e) {
        console.log(e)
    }
}

async function dropTables() {
    try {
        await pool.query(`
            DROP TABLE student cascade;
            DROP TABLE enrollment cascade;
            DROP TABLE course cascade;
            DROP TABLE faculty cascade;
            DROP TABLE department cascade;
            DROP TABLE course_schedule_block cascade;
            DROP TABLE availability_block cascade;
        `)
        pool.end()
        // process.exit()
    }
    catch (e) {
        console.log("2", e)
    }
}

// createAllTables()
// selectQuery()
// insertFaculties()
// insertDepartments()
// insertAdminUser()
// insertCourses()