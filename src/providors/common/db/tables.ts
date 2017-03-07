export let tables = [
      {
    	  name: 'schema_details',
    	  columns:[
                   {name: 'version', type: 'integer DEFAULT 1'},
    	           ]
      },
      {
            name: 'employees',
            columns: [
                {name: 'id', type: 'integer'},
                {name: 'title', type: 'text'},
                {name: 'firstName', type: 'text'},
                {name: 'lastName', type: 'integer'},
                {name: 'licenseNumb', type: 'text'},
                {name: 'discipline', type: 'text'},
                {name: 'empLicense', type: 'text'},
                {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
                {name:'updatedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}
            ]
        },
      {
            name: 'student',
            columns: [
                {name: 'studentId', type: 'text'},
                {name: 'firstName', type: 'text'},
                {name: 'lastName', type: 'text'},
                {name: 'dateOfBirth', type: 'integer'},
                {name: 'male', type: 'text'},
                {name: 'female', type: 'text'},
                {name: 'office', type: 'text'},
                {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
                {name:'updatedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}
            ]
        },
      {
            name: 'ifsp',
            columns: [
                {name: 'ifspId', type: 'integer'},
                {name: 'studentId', type: 'text'},
                {name: 'employeeId', type: 'integer'},
                {name:'serviceBegin', type:'integer'},
                {name:'serviceEnd', type:'integer'},
                {name:'serviceType', type:'text'},
                {name:'serviceTypeDefinition', type:'text'},
                {name:'serviceMethodType', type:'string'},
                {name:'locationType', type:'text'},
                {name:'locationDesc', type:'text'},
                {name:'serviceMinutes', type:'integer'},
                {name:'serviceDaysPerWeek', type:'integer'},
                {name:'frequencyPerMonth', type:'integer'},
                {name:'serviceWeeks', type:'integer'},
                {name:'totalBillingServiceUnits', type:'integer'},
                {name:'billingServiceUnitsRem', type:'integer'},
                {name:'division', type:'integer'},
                {name:'cptCode', type:'text'},
                {name:'cptCode2', type:'text'},
                {name:'cptCode3', type:'text'},
                {name:'cptCode4', type:'text'},
                {name:'icd10Code', type:'text'},
                {name:'icd10Code2', type:'text'},
                {name:'more3hb', type:'integer'},
                {name:'moreSame', type:'integer'},
                {name:'makeUps', type:'integer'},
                {name:'sessionCode', type: 'integer'},
                {name:'sessionCountToday', type: 'integer'},
                {name:'sessionCountLastWeek', type: 'integer'},
                {name:'sessionCountLastMonth', type: 'integer'},
                {name:'sessionCountThisMonth', type: 'integer'},
                {name:'sessionCountThisWeek', type: 'integer'},
                {name:'sessionCountIfspId', type: 'integer'},
                {name:'cancelledSessionCountToday', type: 'integer'},
                {name:'cancelledSessionCountLastWeek', type: 'integer'},
                {name:'cancelledSessionCountLastMonth', type: 'integer'},
                {name:'cancelledSessionCountThisMonth', type: 'integer'},
                {name:'cancelledSessionCountThisWeek', type: 'integer'},
                {name:'cancelledSessionCountIfspId', type: 'integer'},
                {name:'timeCardsEiConflictCount', type: 'integer'},
                {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
                {name:'updatedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}
            ]
        },
      {
            name: 'outcomes',
            columns: [
                {name: 'outcomeId', type: 'integer'},
                {name: 'dateEntered', type: 'integer'},
                {name: 'studentId', type: 'text'},
                {name: 'ifspOutcomeNumber', type: 'integer'},
                {name: 'outcomeNumber', type: 'integer'},
                {name: 'outcome', type: 'text'},
                {name: 'objective1', type: 'text'},
                {name: 'objective2', type: 'text'},
                {name: 'objective3', type: 'text'},
                {name: 'objective4', type: 'text'},
                {name: 'objective5', type: 'text'},
                {name: 'sortNumber', type: 'integer'},
                {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
                {name:'updatedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}
            ]
        },
        {
        	name: 'user_table',
        	columns:[
        	         {name: 'userId', type: 'integer  PRIMARY KEY'},
        	         {name:'username', type:'text'},
        	         {name:'pass',type:'text'},
        	         {name:'employeeId',type:'integer'},
                     {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
                     {name:'lastLoggedIn', type:'integer'},
                     {name:'lastTimeDataLoaded', type:'integer'},
                     {name: 'week',type:'integer default 99'}
        	]
        },
        {
        	name: 'session_note',
        	columns:[               
        	                        {name:'sessionId',     type:'INTEGER PRIMARY KEY'},
        	                        {name:'sessionType',     type:'string'},
        	                        {name:'serviceType',     type:'string'},
        	                        {name:'serviceMethodType', type:'string'},
        	                        {name:'studentId',     type:'string'},
        	                        {name:'firstName',     type:'string'},
        	                        {name:'lastName',     type:'string'},
        	                        {name:'status',     type:'string'},
        	                        {name:'ifspId',     type:'string'},
        	                        {name:'sessionDate',     type:'integer'},
        	                        {name:'timeIn',     type:'integer'},
        	                        {name:'timeOut',     type:'integer'},
        	                        {name:'ifspServiceDuration',     type:'integer'},
        	                        {name:'dateNoteWritten',     type:'integer'},
        	                        {name:'icdCode1',     type:'string'},
        	                        {name:'otherIcdCode2',     type:'string'},
        	                        {name:'serviceBegin',     type:'integer'},
        	                        {name:'serviceEnd',     type:'integer'},
        	                        {name:'location',     type:'string'},
        	                        {name:'cptCode4',     type:'string'},
        	                        {name:'cptUnit1',     type:'string'},
        	                        {name:'cptCode2',     type:'string'},
        	                        {name:'cptCode1',     type:'string'},
        	                        {name:'cptUnit2',     type:'string'},
        	                        {name:'cptUnit3',     type:'string'},
        	                        {name:'cptCode3',     type:'string'},
        	                        {name:'cptUnit4',     type:'string'},
        	                        {name:'hcpcsCode',     type:'string'},
        	                        {name:'hcpcsUnit',     type:'string'},
        	                        {name:'sessionParticipantsChild',     type:'string'},
        	                        {name:'sessionParticipantsParent',     type:'string'},
        	                        {name:'sessionParticipantsOther',     type:'string'},
        	                        {name:'sessionParticipantsOtherName',     type:'string'},
        	                        {name:'additionalInfo',     type:'string'},
        	                        {name:'outcomeAndObjectives',     type:'string'},
        	                        {name:'activity',     type:'string'},
        	                        {name:'coachParentCaregiver',     type:'string'},
        	                        {name:'ifspServiceLocation',     type:'string'},
        	                        {name:'sessionParticipants',     type:'string'},
        	                        {name:'parentUnavailable',     type:'string'},
        	                        {name:'ifspProgress',     type:'string'},
        	                        {name:'activities',     type:'string'},
        	                        {name:'strategiesBetweenVisits',     type:'string'},
        	                        {name:'therapistSignature',     type:'string'},
        	                        {name:'therapistSignatureDate',     type:'integer'},
        	                        {name:'therapistCredentials',     type:'string'},
        	                        {name:'parentSignature',     type:'string'},
        	                        {name:'parentSignatureDate',     type:'integer'},
        	                        {name:'signedRelationship',     type:'string'},
        	                        {name:'license',     type:'string'},
        	                        {name:'reason',     type:'string'},
        	                        {name:'otherReason',     type:'string'},
        	                        {name:'notified',     type:'string'},
        	                        {name:'serviceMinutes',     type:'integer'},
        	                        {name:'lastMakeupDate',     type:'integer'},
        	                        {name:'makupDate',     type:'integer'},
        	                        {name:'absentCardId',     type:'integer'},
        	                        {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'},
        	                        {name:'updatedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}]
        },{
        	name: 'makeup_dates',
        	columns: [
                      {name:'studentId',     type:'string'},
                      {name:'makeupDate',     type:'integer'},
                      {name:'absentCardId',     type:'integer'}
                      
        	]
        },{
        	name: 'sn_extra',
        	columns: [
                      {name:'sessionId',     type:'INTEGER'},
                      {name:'fieldType',     type:'string'},
                      {name:'fieldValue',     type:'string'},
                      {name:'valueSequence',     type:'integer'},
                      {name:'dataType',           type:'string DEFAULT "VARCHAR" '}
        	]
        },
        {
        	name: 'sn_errors',
        	columns:[
                     {name:'sessionId',     type:'INTEGER'},
                     {name:'errorMessage',     type:'string'}
        	]
        },
        {
        	name: 'sn_history',
        	columns:[
        	         {name: 'histId', type: 'integer  PRIMARY KEY'},
                     {name:'studentId',     type:'string'},
                     {name:'firstName',     type:'string'},
                     {name:'lastName',     type:'string'},
                     {name:'sessionType',     type:'string'},
                     {name:'sessionDate',     type:'integer'},
                     {name:'timeIn',     type:'integer'},
                     {name:'timeOut',     type:'integer'},
                     {name:'ifspServiceDuration',     type:'integer'},
                     {name:'dateNoteWritten',     type:'integer'},
                     {name:'insertedAt', type:'Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP'}
        	]
        },
        {
        	name: 'cpt_codes',
        	columns:[
                     {name:'serviceType', type:'string'},
                     {name:'serviceSubType', type:'string'},
                     {name:'icd10Code',     type:'string'},
                     {name:'cptCode',          type:'string'},
                     {name:'crosswalk',          type:'string'}
        	         ]
        }, 
        {
        	name: 'icd_codes',
        	columns: [
                      {name:'icd10Code',     type:'string'},
                      {name:'description',     type:'string'}
        	]
        },{
        	name: 'missing_count',
        	columns: [
                      {name:'ifspId',     type:'integer'},
                      {name:'WeekOf',     type:'integer'},
                      {name:'missing',     type:'integer'}
                      
        	]
        }
    ]