
export class SessionNote{

    sessionId: number;
    employeeId: number;
    sessionType: string;
    studentId: string;


    serviceType: string;
    serviceMethodType: string;
    firstName: string;
    lastName: string;
    status: string;
    ifspId: string;
    sessionDate: number;

    icdCode1: string;
    otherIcdCode2: string;
    serviceBegin: number;
    ServiceBeginDisplay: Date;
    serviceEnd: number;
    serviceEndDisplay: number;
    location: string;
    cptCode4: string;
    cptUnit1: string;
    cptCode2: string;
    cptCode1: string;
    cptUnit2: string;
    cptUnit3: string;
    cptCode3: string;
    cptUnit4: string;
    hcpcsCode: string;
    hcpcsUnit: string;
    sessionParticipantsChild: string;
    sessionParticipantsParent: string;
    sessionParticipantsOther: string;
    sessionParticipantsOtherName: string;
    additionalInfo: string;
    outcomeAndObjectives: string;
    activity: string;
    coachParentCaregiver: string;
    ifspServiceLocation: string;
    sessionParticipants: string;
    parentUnavailable: string;
    ifspProgress: string;
    activities: string;
    strategiesBetweenVisits: string;
    therapistSignature: string;
    therapistSignatureDate: number;
    therapistSignatureDateDisplay: Date;
    therapistCredentials: string;
    parentSignature: string;
    parentSignatureDate: number;
    parentSignatureDateDisplay: Date;
    signedRelationship: string;
     signedRelationshipOther: string;
    license: string;
    reason: string;
    otherReason: string;
    notified: string;
    serviceMinutes: number;
    dateOfAbsent: number;
    lastMakeupDate: number;
    lastMakeupDateDisplay: Date;
    makeupDate: number;
    makupDateDisplay: Date;
    extraValues: Array<any>;
    statusDisplay: string;
    delayReason: string;
    editable: boolean = false;
    timecardStatus: string;
    absentCardId: number;
    cardId: number;
    appSessionId: number;
    sessionCode: number;
    rate: number;

    get sessionDateDisplay(): string {
        if(this.sessionDate)
          return new Date(this.sessionDate).toISOString();
        return "";//new Date().toISOString();
        
    }

    set sessionDateDisplay(value: string) {
       this.sessionDate  = new Date(value).getTime();
    }


    timeIn: number;
    get timeInDisplay(): string {
        if(this.timeIn)
          return new Date(this.timeIn).toISOString();
        return new Date().toISOString();
        
    }

    set timeInDisplay(value: string) {
       this.timeIn  = new Date(value).getTime();
    }

    timeOut: number;
    get timeOutDisplay(): string {
        if(this.timeOut)
          return new Date(this.timeOut).toISOString();
        return new Date().toISOString();
        
    }

    set timeOutDisplay(value: string) {
       this.timeOut  = new Date(value).getTime();
    }
    
    ifspServiceDuration: number;
    dateNoteWritten: number;

    get dateNoteWrittenDisplay(): string {
        if(this.dateNoteWritten)
          return new Date(this.dateNoteWritten).toISOString();
        return "";//new Date().toISOString();
        
    }

    set dateNoteWrittenDisplay(value: string) {
       this.dateNoteWritten  = new Date(value).getTime();
    }


}