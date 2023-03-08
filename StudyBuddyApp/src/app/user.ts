import { Course } from "./course"

export class User {

    fName: string
    lName : string
    password: string
    courseCount: number
    courses : Course[]

    // add more later 
    // ie friends messages etc

    constructor(fn : string , ln :string,  p : string , cCount : number , courses:Course[]){
        this.fName = fn
        this.lName = ln
        this.password = p
        this.courseCount = cCount
        this.courses = courses
    }

}
