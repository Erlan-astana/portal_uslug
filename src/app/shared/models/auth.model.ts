// tslint:disable-next-line:no-namespace
export namespace auth {
  export class User {
    constructor(
      public active: boolean = false,
      public blocked: boolean = false,
      public id: number = null,
      public firstName: string = '',
      public lastName: string = '',
      public secondName: string = '',
      public iin: string = '',
      public bin: any = null,
      public orgName: any = null,
      public organization: any = null,
      public userType: any = null,
      public username: string = '',
      public link: any = null,
      public positionKk: any = null,
      public positionRu: any = null,
      public roles: any = null,
      public status: any = null,
      public email: string = '',
      public regionId: any = null,
      public phone: any = null
    ) {
    }
  }
}
