import {FormControl, FormGroup, Validators} from '@angular/forms';
import {auth} from './auth.model';
import {app} from './application.model';

// tslint:disable-next-line:no-namespace
export namespace dic {
  import User = auth.User;

  export class Phase {
    constructor(
      public id: number = 1,
      public nameRu: string = '',
      public nameKk: any = null,
      public nameEn: any = null
    ) {
    }
  }

  export class Role {
    constructor(
      public id: any = null,
      public nameRu: string = '',
      public nameKk: string = '',
      public nameEn: string = '',
      public name: string = '',
      public shortNameRu: string = '',
      public shortNameKk: string = '',
      public shortNameEn: string = '',
      public description: string = ''
    ) {
    }
  }

  export class Problem {
    constructor(
      public id: any = null,
      public name: string = '',
      public assignee: string = '',
      public formKey: any = null,
      public content: Decide = null,
      public createTime: any = null,
      public timerData: TimerData = new TimerData(),
    ) {
    }
  }

  export class ApprovalList {
    constructor(
      public lingual: boolean = false,
      public jurist: boolean = false,
      public apparat: boolean = false,
      public zamakim: boolean = false,
      public zamakim1: boolean = false,
      public rukozo: boolean = false,
      public kanc: boolean = false,
      public finance: boolean = false,
      public econom: boolean = false,
      public zam1: boolean = false,
      public zam2: boolean = false,
      public zam3: boolean = false,
      public zam4: boolean = false,
      public zam5: boolean = false,
      public rukarch: boolean = false,
      public prav: boolean = false,
      public org: boolean = false,
      public prav_head: boolean = false,
      public inspector: boolean = false,
      public doc: boolean = false
    ) {
    }
  }

  export class Decide {
    constructor(
      public approved: boolean = null,
      public agreed: boolean = null,
      public akim_agreed: boolean = null,
      public message: string = '',
      public actFinalText: string = '',
      public planEndDate: any = new Date(),
      public files: any = [],
      public from: string = null,
      public internalFiles: any = [],
      public signedDocument: any = null,
      public communalSigned: boolean = null,
      public commissionText: string = '',
      public orderText: string = null,
      public lingual: boolean = false,
      public jurist: boolean = false,
      public inspector: boolean = false,
      public doc: boolean = false,
      public apparat: boolean = false,
      public akt: boolean = false,
      public orgAgreed: boolean = false,
      public zamakim: boolean = false,
      public zamakim1: boolean = false,
      public zam1: boolean = false,
      public zam2: boolean = false,
      public zam3: boolean = false,
      public zam4: boolean = false,
      public zam5: boolean = false,
      public org: boolean = false,
      public prav: boolean = false,
      public prav_head: boolean = false,
      public rukarch: boolean = false,
      public rukozo: boolean = false,
      public number: string = null,
      public date: Date = new Date(),
      public scan: string = null,
      public scanFiles: any = [],
      public zkFiles: any = [],
      public regionId: any = [],
      public owner: string = '',
      public control: string = '',
      public controlName: string = '',
      public executor: string = '',
      public executorName: string = '',
      public comments: any = [],
      public suggestions: any = [],
      public recomendation: string = '',
      public zemkom: boolean = null,
      public spr_agreed: boolean = null,
      public pto_agreed: boolean = null,
      public ins_agreed: boolean = null,
      public jurist_check: boolean = false,
      public subserviceId: number = null,
      public recom_agreed: boolean = null,
      public post: boolean = false,
      public agreement: boolean = false,
      public role: string = '',
      public kanc: boolean = false,
      public finance: boolean = false,
      public econom: boolean = false,
      public code: string = '',
      public order: any = null,
      public revoked: boolean = false,
      public finish: boolean = false,
      public arch_agreed: boolean = null,
      public gas_agreed: boolean = null,
      public water_agreed: boolean = null,
      public heat_agreed: boolean = null,
      public energy_agreed: boolean = null,
      public kazakhtelecom_agreed: boolean = null,
      public transtelecom_agreed: boolean = null,
      public ozo_agreed: boolean = null,
      public baizak_agreed: boolean = null,
      public merke_agreed: boolean = null,
      public igilik_agreed: boolean = null,
      public janatas_agreed: boolean = null,
      public kordai_agreed: boolean = null,
      public aksu_agreed: boolean = null,
      public teplo_agreed: boolean = null,
      public archMessage: string = '',
      public ozoMessage: string = '',
      public gasText: string = '',
      public energoText: string = '',
      public kazahtelecomText: string = '',
      public transtelecomText: string = '',
      public ozoText: string = '',
      public BaizakSuText: string = '',
      public IgilikText: string = '',
      public KordaiSuText: string = '',
      public AksuKordaiText: string = '',
      public JanatasSuJyluText: string = '',
      public MerkeSuText: string = '',
      public KulanEnergoJyluText: string = '',
      public TazaSuText: string = '',
      public energo_zhesText: string = '',
      public water_zhambyl_suText: string = '',
      public teplo_zhambyl_zhyluText: string = '',
      public gas: boolean = false,
      public energo: boolean = false,
      public kazahtelecom: boolean = false,
      public transtelecom: boolean = false,
      public ozo: boolean = false,
      public TazaSu: boolean = false,
      public KulanEnergoJylu: boolean = false,
      public Igilik: boolean = false,
      public JanatasSuJylu: boolean = false,
      public KordaiSu: boolean = false,
      public AksuKordai: boolean = false,
      public BaizakSu: boolean = false,
      public MerkeSu: boolean = false,
      public energo_zhes: boolean = false,
      public water_zhambyl_su: boolean = false,
      public teplo_zhambyl_zhylu: boolean = false,
      public orgCode: string = '',
      public KulanEnergoJyluApproved: boolean = false,
      public kazahtelecomApproved: boolean = false,
      public gasApproved: boolean = false,
      public energoApproved: boolean = false,
      public transtelecomApproved: boolean = false,
      public TazaSuApproved: boolean = false,
      public ozoApproved: boolean = false,
      public BaizakSuApproved: boolean = false,
      public IgilikApproved: boolean = false,
      public KordaiSuApproved: boolean = false,
      public AksuKordaiApproved: boolean = false,
      public JanatasSuJyluApproved: boolean = false,
      public MerkeSuApproved: boolean = false,
      public energo_zhesApproved: boolean = false,
      public water_zhambyl_suApproved: boolean = false,
      public teplo_zhambyl_zhyluApproved: boolean = false,
      public up5kvt: boolean = false,
      public communalStatus: string = '',
      public communalResults: string = '',
      public resolutionText: string = '',
      public prelim_agreed: boolean = false,
      public actResult: boolean = false
    ) {
    }
  }

  export class TaskData {
    constructor(
      public name: string = null,
      public assignee: string = null,
      public owner: string = 'arch',
      public dueDate: Date = new Date(),
      public processInstanceId: any = null,
      public content = new TaskContent(),
      public id: number = null
    ) {
    }
  }

  export class TaskForRefresh {
    constructor(
      public executor: string = null,
      public owner: string = 'arch',
      public dueDate: any = new Date(),
      public control: any = null,
      public executorName: string = null,
      public controlName: string = null
    ) {
    }
  }

  export class TaskContent {
    constructor(
      public approved: boolean = null,
      public agreed: boolean = null,
      public appId: number = null,
      public type: string = null,
      public message: any = null,
      public registerDate: any = new Date(),
      public registerNumber: any = null,
      public dueDate: any = null,
      public planEndDate: any = null,
      public control: any = null,
      public executor: string = '',
      public files: any = null,
      public executorName: string = null,
      public controlName: string = null,
      public from: string = null,
      public internalFiles: any = null,
      public signedDocument: boolean = null,
      public subserviceType: string = null,
      public org: string = null,
      public role: string = null,
      public subserviceId: any = null,
      public code: string = null,
      public communal: boolean = null
    ) {
    }
  }

  export class TemplateEditor {
    constructor(
      public id: number = null,
      public approved: boolean = null,
      public nameKk: string = null,
      public nameRu: string = null,
      public text: string = '',
      public subserviceId: number = null,
      public orgId: number = 1,
      public regionId: number = null
    ) {
    }
  }

  export class SubjectTemplateEditor {
    constructor(
      public id: number = null,
      public nameKk: string = null,
      public nameRu: string = null,
      public text: string = null,
      public contractSubject: any = {},
    ) {
    }
  }

  export class Service {
    constructor(
      public id: number = null,
      public nameRu: string = '',
      public nameKk: string = '',
      public nameEn: string = '',
      public shortNameKk: string = '',
      public shortNameRu: string = '',
      public shortNameEn: string = '',
      public code: string = ''
    ) {
    }
  }

  export class Subservices {
    constructor(
      public id: number = null,
      public nameRu: string = '',
      public nameKk: string = '',
      public nameEn: string = '',
      public shortNameKk: string = '',
      public shortNameRu: string = '',
      public shortNameEn: string = '',
      public service: Service = new Service(),
      public days: number = null,
      public workdaysOnly: boolean = false,
      public code: any = null
    ) {
    }
  }

  export class CategoryFiles {
    constructor(
      public id: number = null,
      public categoryFiles: any = [],
      public categoryFilesUpload: any = [],
      public extensions: any = null,
      public required: boolean = false,
      public subserviceId: number = null,
      public title: string = '',
      public titleKk: string = '',
      public titleRu: string = '',
      public type: string = 'app',
      public display: boolean = true
    ) {
    }
  }

  export class Correspondence {
    constructor(
      public id: number = null,
      public regNumber: number = null,
      public type: string = '',
      public executeDueDate: Date = new Date(),
      public sender: string = '',
      public executable: boolean = false,
      public executor: User = new User(),
      public regDate: Date = new Date(),
      public body: string = '',
      public outDate: Date = new Date(),
      public category: any = null,
      public files: any = [],
    ) {
    }
  }

  export class AdmDocument {
    constructor(
      public id: number = null,
      public author: string = null,
      public nameRu: string = '',
      public nameEn: string = '',
      public nameKk: string = '',
      public employee: User = new User(),
      public date: Date = new Date(),
      public body: string = '',
      public category: any = null
    ) {
    }
  }

  export class SpecReg {
    constructor(
      public id: number = null,
      public orderNumber: number = null,
      public specregNumber: number = null,
      public iin: number = null,
      public firstName: string = '',
      public lastName: string = '',
      public secondName: string = '',
      public regAddressRu: string = '',
      public regAddressKk: string = '',
      public factAddressRu: string = '',
      public factAddressKk: string = '',
      public date: Date = new Date(),
      public mobile: string = '',
      public phone: any = null,
      public appId: number = null,
      public specregNumberType: string = null,
      public specregSourceType: string = 'RGIS',
      public birthDate: any = null,
      public regionId: any = null
    ) {
    }
  }

  export class PhasePeriod {
    constructor(
      public id: number = 1,
      public nameRu: string = '',
      public nameKk: any = null,
      public nameEn: any = null
    ) {
    }
  }

  export class Contract {
    constructor(
      public id: any = null,
      public subject: Subject = new Subject(),
      public number: number = null,
      public date: Date = new Date(),
      public dueDate: Date = new Date(),
      public createDate: Date = new Date(),
      public sum: number = null,
      public customer: Customer = new Customer(),
      public description: string = '',
      public author: string = '',
      public body: string = '',
      public prevContract: Contract = null
    ) {
    }
  }

  export class MonitoringContract {
    constructor(
      public id: any = null,
      public subject: Subject = new Subject(),
      public number: number = null,
      public date: Date = new Date(),
      public dueDate: Date = new Date(),
      public createDate: Date = new Date(),
      public sum: number = null,
      public customer: Customer = new Customer(),
      public description: string = '',
      public author: auth.User = null,
      public body: string = '',
      public prevContract: Contract = null,
      public app: app.App = null,
      public mainLateDays: Date = null
    ) {
    }
  }

  export class Subject {
    constructor(
      public id: number = null,
      public nameRu: string = '',
      public nameKk: string = '',
      public nameEn: string = '',
      public subjectType: string = ''
    ) {
    }
  }

  export class Customer {
    constructor(
      public id: number = null,
      public firstName: string = '',
      public lastName: string = '',
      public secondName: string = '',
      public iin: number = null
    ) {
    }
  }

  export class ContractExecution {
    constructor(
      public id: any = null,
      public contract: Contract = new Contract(),
      public comment: string = '',
      public dueDate: Date = new Date(),
      public factSum: string = '',
      public sum: number = null,
      public specialText: string = '',
      public executed: boolean = false
    ) {
    }
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
      public communal: any = null
    ) {
    }
  }


  export class Organizations {
    constructor(
      public id: number = null,
      public appOrgFiles: any = [],
      public appOrgId: number = null,
      public connections: string = '',
      public hasTechCondition: boolean = false,
      public name: string = '',
      public responseDate: any = null,
      public sendDate: any = null,
      public sent: boolean = false,
      public status: string = null,
      public techCondition: any = null
    ) {
    }
  }

  export class FilterTable {
    constructor(
      public key: string = '',
      public operation: string = '',
      public value: any = '',
      public options: any = '',
      public value2: any = null,
      public type: string = 'string'
    ) {
    }
  }

  export class TimerData {
    constructor(
      public days: number = null,
      public hours: number = null,
      public minutes: number = null,
      public seconds: number = null,
    ) {
    }
  }

  export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    valids: any;
    options: { key: string, value: string }[];
    disabled: boolean;

    constructor(options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      disabled?: boolean;
      valids?: any;
      options?: { key: string, value: string }[];
    } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.options = options.options || [];
      this.disabled = !!options.disabled;
      this.valids = options.valids || [];
    }
  }

  export class IntegrationInfo {
    constructor(
      public id: number = null,
      public appId: number = null,
      public requestNumber: number = null,
      public serviceId: number = null,
      public messageId: number = null,
      public correlationId: number = null,
      public messageDate: any = null,
      public messageType: any = null,
      public processType: any = null,
      public systemInfoRequestNumber: number = null,
      public systemInfoChainId: number = null,
      public systemInfoRequestDate: any = null,
      public systemInfoResponseCode: null,
      public systemInfoAdditionalInfoRu: null,
      public systemInfoAdditionalInfoKz: null,
      public pepStep: number = null
    ) { }
  }

}
