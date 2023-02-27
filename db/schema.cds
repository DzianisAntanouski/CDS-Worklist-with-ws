namespace models;

using {cuid} from '@sap/cds/common';

type Status : String enum {
    ready;
    process;
}

entity Models : cuid {
    Name        : String(100) @title: 'Name';
    Description : String(200) @title: 'Description';
    URI         : String(200) @title: 'URI';
    Date        : String      @title: 'Date';
    Status      : Status      @title: 'Status';
    criticality : Integer;
}

// annotate Models with @(
//   Capabilities.InsertRestrictions : {
//     Insertable : true,
//   }
// );
