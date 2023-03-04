import { TimeStartEnd } from "./time-start-end";

export class Section {
    timeSlot : TimeStartEnd
    name : string

    constructor(n : string  , t : TimeStartEnd){
        this.timeSlot =t;
        this.name = n;
    }
}
