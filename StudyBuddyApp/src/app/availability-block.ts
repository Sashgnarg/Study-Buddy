import { TimeStartEnd } from "./time-start-end";

export class AvailabilityBlock {
    time : TimeStartEnd 
    day : string

    constructor(t :TimeStartEnd , day : string){
        this.time = t;
        this.day=day
    }
}
