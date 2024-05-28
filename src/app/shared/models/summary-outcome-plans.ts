export class SummaryOutcomePlans {
    id: number;
    sharedPathwayId: number;
    sectionName: string;
    outcomesNeedToAchieve: string;
    whatNeedToDo: string;
    personWorkingWithMe: string;
    timeScalesReviewsNote: Date;
    constructor(){
        this.timeScalesReviewsNote = new Date();
    } 
}