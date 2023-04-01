import { AvailabilityBlock } from "./availability-block"
import { Course } from "./course"
import { Section } from "./section"

export class User {

    uID?: number
    combatibilityPosition?:number
    uName: string
    fName: string
    lName: string
    faculty: string
    password: string
    courseCount: number
    bio:string

    // order of courses array corresponds to order of sections array
    // ie :  if enrolled courses[j] , user is in section section[j]  
    courses: Course[]
    sections: Section[]
    availabilityBlock: AvailabilityBlock[][]

    // add more later 
    // ie friends messages etc

    constructor(un: string, fn: string, ln: string, f: string, p: string, cCount: number, courses: Course[], sections: Section[], ab: AvailabilityBlock[][]) {
        this.uName = un
        this.fName = fn
        this.lName = ln
        this.faculty = f
        this.password = p
        this.courseCount = cCount
        this.courses = courses
        this.sections = sections
        this.availabilityBlock = ab
        this.bio =''
    }
    setId(num : number){
        this.uID = num
    }
    setCombatibility(num : number){
        this.combatibilityPosition= num
    }
    setBio(bio : string){
        this.bio = bio
    }

}
