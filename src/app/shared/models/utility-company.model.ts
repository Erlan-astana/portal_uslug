import { app } from './application.model';

export namespace utilcompany {

    import AppStatus = app.AppStatus;

    export class UtilComAppPage {
        constructor(
            public content: UtilCompanyApp[] = [],
            public first: boolean = false,
            public last: boolean = false,
            public number: number = null,
            public numberOfElements: number = null,
            public size: number = 15,
            public sort: any = null,
            public pageable: any = null,
            public totalElements: number = 0,
            public totalPages: number = null
        ) { }
    }

    export class UtilCompanyApp {
        constructor(
            public id: number = null,
            public app: app.App = null,
            public appOrgFiles: any = [],
            public appOrgObjects: any = [],
            public confirmerStatus: any = null,
            public connections: any = null,
            public connectionsData: any = null,
            public currentStatus: app.AppStatus = new AppStatus(),
            public hasTechCondition: boolean = false,
            public organization: Organization = new Organization(),
            public recommendation: string = null,
            public recommendationDate: any = null,
            public recommendationUserId: any = null,
            public signed: boolean = false,
            public signedDate: any = null,
            public meetingStatus: app.AppStatus = new AppStatus(),
            public toSign: boolean = false
        ) { }
    }

    export class Communal {
        constructor(
            public id: number = null,
            public nameRu: string = '',
            public nameKk: string = '',
            public nameEn: string = '',
        ) { }
    }

    export class Organization {
        constructor(
            public id: number = null,
            public name: string = '',
            public nameRu: string = '',
            public nameKk: string = '',
            public orgType: any = null,
            public ozoConfirmer: boolean = false,
            public regionId: number = null,
            public regionNameKk: string = '',
            public regionNameRu: string = '',
            public shortName: string = null,
            public shortNameEn: string = null,
            public shortNameKk: string = null,
            public shortNameRu: string = null,
            public headUserName: string = '',
            public headUserPositionKk: string = '',
            public headUserPositionRu: string = '',
            public headUserShortName: string = '',
            public communal: Communal = new Communal()
        ) { }
    }

    export class Template {
        constructor(
            public id: number,
            public nameRu: string,
            public nameKk: string,
            public text: string,
            public orgId: number,
            public approved: boolean,
            public subserviceId: number
        ) { }
    }

}
