export class AvailabilityBlock {
    start_time: number
    is_available: boolean

    constructor(start_time: number, is_available: boolean) {
        this.start_time = start_time;
        this.is_available = is_available
    }
}
