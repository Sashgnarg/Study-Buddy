import { Section } from "./section"
import { TimeStartEnd } from "./time-start-end"

export class Course {
    private code:string 
    private sections: Section[]
    private course_id? :number

    constructor(){
        this.code =''
        this.sections = []
    }

    getCode():string{
        return this.code
    }
    getSections():Section[]{
        return this.sections;
    }

    setCode(c : string){
        this.code= c;
    }
    addSection( s : string , start : string , end :string ){
        this.sections.push( new Section(s , new TimeStartEnd( start , end)))
    }
}
