

export class Validation{
        constructor(hasError?: boolean, errorList? : Array<string>, hasWarning?: boolean ,warningList?: Array<string>){
            this.hasError = hasError;
            if(errorList)
            this.errorList = errorList;
            this.hasWarning = hasWarning;
            if(warningList)
            this.warningList = warningList;
        }
    	hasError: boolean =  false;
		errorList : Array<string> =  [];
        hasWarning: boolean =  false;
        warningList: Array<string> =  [];
        missingTotal: number = 0;
}