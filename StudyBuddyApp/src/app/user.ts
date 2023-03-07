import { Course } from "./course"

export class User {

    name: string
    password: string
    courseCount: number
    courses : Course[]

    // add more later 
    // ie friends messages etc

    constructor(n : string , p : string , cCount : number , courses:Course[]){
        this.name = n
        this.password = p
        this.courseCount = cCount
        this.courses = courses
    }

}
