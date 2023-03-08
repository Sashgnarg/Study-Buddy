import { Course } from "./course"
import { Section } from "./section"

export class User {

    fName: string
    lName : string
    password: string
    courseCount: number

    // order of courses array corresponds to order of sections array
    // ie :  if enrolled courses[j] , user is in section section[j]  
    courses : Course[]
    sections : Section[]

    // add more later 
    // ie friends messages etc

    constructor(fn : string , ln :string,  p : string , cCount : number , courses:Course[] , sections:Section[]){
        this.fName = fn
        this.lName = ln
        this.password = p
        this.courseCount = cCount
        this.courses = courses
        this.sections = sections;
    }

}
