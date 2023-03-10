import { Course } from "./course"
import { Section } from "./section"

export class User {

    uName: string
    fName: string
    lName : string
    faculty : string
    password: string
    courseCount: number

    // order of courses array corresponds to order of sections array
    // ie :  if enrolled courses[j] , user is in section section[j]  
    courses : Course[]
    sections : Section[]

    // add more later 
    // ie friends messages etc

    constructor( un:string,   fn : string , ln :string, f : string ,  p : string , cCount : number , courses:Course[] , sections:Section[]){
        this.uName = un
        this.fName = fn
        this.lName = ln
        this.faculty = f
        this.password = p
        this.courseCount = cCount
        this.courses = courses
        this.sections = sections;
    }

}
