using {models} from '../db/schema';


service capService {
    entity Models as select from models.Models;

// function importFile(file: Binary) returns String;
}

annotate capService.Models with @UI: {LineItem: [
    {
        Value            : Name,
        ![@UI.Importance]: #High
    },
    {
        Value            : Description,
        ![@UI.Importance]: #High
    },
    {
        Value            : URI,
        ![@UI.Importance]: #High,
        Criticality : criticality
    },
    {
        Value            : Date,
        ![@UI.Importance]: #High
    },
    {
        Value            : Status,
        ![@UI.Importance]: #High,
        Criticality : criticality
    }
], };
