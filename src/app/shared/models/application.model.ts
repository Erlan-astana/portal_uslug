import {auth} from './auth.model';
import {dic} from './dictionary.model';

// tslint:disable-next-line:no-namespace
export namespace app {
  export class App {
    constructor(
      public id: number = null,
      public zuId: number = null,
      public regAppId: number = null,
      public idx: number = null,
      public appId: number = null,
      public address: any = '',
      public appFiles: any = [],
      public files: any = [],
      public appStatuses: any = null,
      public applicant: string = '',
      public bin: any = null,
      public createDate: any = null,
      public firstName: string = 'ТЕСТ',
      public iin: string = '951013300754',
      public archSigned: any = null,
      public lastName: any = 'ТЕСТОВИЧ',
      public numerationDate: Date = null,
      public numeration: any = null,
      public planEndDate: any = null,
      public factEndDate: any = null,
      public rejectedFile: any = null,
      public approvedFile: any = null,
      public currentExecutor: string = null,
      public currentTaskName: string = null,
      public regionId: number = null,
      public open: any = null,
      public org: boolean = false,
      public otherApplicant: boolean = false,
      public applicantIinBin: number = null,
      public applicantName: string = '',
      public applicantIsOrg: boolean = false,
      public identityCardNumber: string = null,
      public identityCardDistributor: string = null,
      public orgName: any = null,
      public phone: any = '',
      public secondName: any = 'ТЕСТОВ',
      public subservice: dic.Subservices = new dic.Subservices(),
      public objectInfo: ObjectInfo = new ObjectInfo(),
      public taskId: any = null,
      public control: string = null,
      public approved: boolean = null,
      public electricInfo: ElectricInfo = new ElectricInfo(),
      public waterInfo: WaterInfo = new WaterInfo(),
      public sewerageInfo: SewerageInfo = new SewerageInfo(),
      public heatInfo: HeatInfo = new HeatInfo(),
      public gasInfo: GasInfo = new GasInfo(),
      public designerInfo: DesignerInfo = new DesignerInfo(),
      public subscribeEmail: string = null,
      public currentStatus: AppStatus = new AppStatus(),
      public ozoInfo: OzoInfo = new OzoInfo(),
      public landInfo: LandInfo = new LandInfo(),
      public projectName: string = null,
      public projectAddress: string = null,
      public auctionInfo: AuctionInfo = new AuctionInfo(),
      public addressInfo: AddressInfo = new AddressInfo(),
      public requestNumber: any = null,
    ) {
    }
  }

  export class OzoInfo {
    constructor(
      public scale: any = null,
      public districts: any = null,
      public location: string = '',
      public note: any = null,
    ) {
    }
  }

  export class ObjectInfo {
    constructor(
      public id: number = null,
      public name: string = '',
      public address: string = '',
      public period: any = null,
      public floorsCount: any = null,
      public area: any = null,
      public gos: boolean = null,
      public flatsCount: any = null,
      public roomsCount: any = null,
      public cabinetsCount: any = null,
      public cadastreNumber: any = null,
      public difficult: any = null,
      public location: string = null,
      public locationWkt: string = null,
      public archLocation: string = '',
      public useRight: string = null,
      public purpose: string = null,
      public purposeRequested: string = null,
      public changeReason: string = null,
      public inOzo: any = null,
      public detachedBuilding: boolean = null,
      public designer: string = '',
      public licenseCategoryGsl: string = '',
      public licenseNumberGsl: string = '',
      public licenseDateGsl: Date = new Date(),
      public additionalPurposeUse: boolean = false,
      public additionalArea: any = null,
      public identDocNumber: number = null,
      public identDocDate: any = new Date(),
      public legalDocNumber: number = null,
      public legalDocDate: any = new Date(),
      public cultBuilding: string = null,
      public financingSource: string = null,
      public buildingCapacity: string = null,
      public religion: string = null,
      public uzoOzo: string = null,
      public rightDocsReason: string = null,
      public gosAktNumber: string = null,
      public akimDecisionNumber: string = null,
      public akimDecisionDate: string = null,
      public sectionPurpose: string = null,
      public reason: string = null,
      public landRightType: string = null,
      public surveyWorkType: string = null,
      public surveyWorkPurpose: string = null,
      public surveyWorkReason: string = null,
      public landType: string = null,
      public term: string = null,
      public workSchedule: string = null,
      public landCategory: LandCategory = new LandCategory(),
      public funcUse: FuncUse = new FuncUse(),
      public purposeUse: PurposeUse = new PurposeUse(),
      public ownershipForm: OwnershipForm = new OwnershipForm(),
      public rightType: RightType = new RightType(),
      public divisibility: boolean = null
    ) {
    }
  }

  export class MaxLoadByYearsObject {
    constructor(
      public year: string = '',
      public power: string = ''
    ) {
    }
  }

  export class AppStatus {
    constructor(
      public id: number = null,
      public status: string = null,
      public lastStatus: any = null,
      public date: any = null,
      public message: string = null,
      public user: auth.User = null,
      public appId: number = null
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

  export class ElectricInfo {
    constructor(
      public id: number = null,
      public requiredPower: any = null,
      public phase: dic.Phase = new dic.Phase(),
      public phasePeriod: dic.PhasePeriod = new dic.PhasePeriod(),
      public relCat: any = null,
      public relCat1: any = null,
      public relCat2: any = null,
      public relCat3: any = null,
      public maxLoadByYears: any = null,
      public loadCat1: any = null,
      public loadCat2: any = null,
      public loadCat3: any = null,
      public boilerCount: number = null,
      public boilerPower: number = null,
      public heaterCount: any = null,
      public heaterPower: any = null,
      public stoveCount: any = null,
      public stovePower: any = null,
      public furnaceCount: any = null,
      public furnacePower: any = null,
      public waterHeaterCount: any = null,
      public waterHeaterPower: any = null,
      public transformerNumber1: string = '',
      public transformerPower1: any = null,
      public transformerNumber2: string = '',
      public transformerPower2: any = null,
      public maxLoad: any = null,
      public onePhaseElecSem: any = null,
      public threePhaseElecSem: any = null,
      public telephoneSem: any = null
    ) {
    }
  }

  export class WaterInfo {
    constructor(
      public id: number = null,
      public dayDrink: number = null,
      public hourDrink: any = null,
      public maxDrink: any = null,
      public dayIndustrial: any = null,
      public hourIndustrial: any = null,
      public maxIndustrial: any = null,
      public firefighting: any = null,
      public total: any = null,
      public totalDrink: any = null,
      public maxTotal: any = null,
      public hourDrinkSem: any = null,
      public hourIndustrialSem: any = null,
      public totalSem: any = null,
      public waterDisposal: any = null,
      public waterDisposalSem: any = null,
      public centralHotWater: any = null,
      public centralHotWaterSem: any = null,
      public power: any = null,
      public hoz: any = null,
      public production: any = null,
    ) {
    }
  }

  export class SewerageInfo {
    constructor(
      public id: number = null,
      public fecal: any = null,
      public maxFecal: any = null,
      public industrial: number = null,
      public maxIndustrial: any = null,
      public clean: any = null,
      public maxClean: any = null,
      public total: any = null,
      public maxTotal: any = null,
      public centralSewerageSem: any = null,
      public production: any = null,
      public power: any = null,
      public centralSewerage: any = null
    ) {
    }
  }

  export class HeatInfo {
    constructor(
      public id: number = null,
      public heating: any = null,
      public ventilation: any = null,
      public hotWater: number = null,
      public technical: any = null,
      public total: any = null,
      public centralHeatingSem: any = null,
      public firing: any = null,
      public power: any = null
    ) {
    }
  }

  export class GasInfo {
    constructor(
      public id: number = null,
      public total: any = null,
      public gazification: any = '',
      public gasBoilers: GasBoiler[] = null,
      public gasStoves: GasStove[] = null,
      public gasWaterHeaters: GasWaterHeater[] = null,
      public gazificationSem: any = null,
      public ventilation: any = null,
      public conditioning: number = null,
      public hotWater: any = null,
      public power: any = null,
      public cooking: any = null,
      public heating: any = null
    ) {
    }
  }

  export class GasBoiler {
    constructor(
      public id: any = null,
      public boilerName: any = null,
      public boilerAmount: any = null,
      public boilerPower: any = null,
    ) {}
  }

  export class GasStove {
    constructor(
      public id: any = null,
      public gasStoveName: any = null,
      public gasStoveAmount: any = null,
      public gasStovePower: any = null,
    ) {}
  }

  export class GasWaterHeater {
    constructor(
      public id: any = null,
      public waterHeater: any = null,
      public waterHeaterAmount: any = null,
      public waterHeaterPower: any = null,
    ) {}
  }

  export class DesignerInfo {
    constructor(
      public id: number = null,
      public firstName: string = '',
      public lastName: string = '',
      public secondName: string = '',
      public iin: any = '',
      public userType: string = null,
      public orgName: any = null,
      public bin: any = null,
      public licenseNumber: any = null,
      public licenseCategory: any = null,
      public phone: any = null
    ) {
    }
  }

  export class LandInfo {
    constructor(
      public id: number = null,
      public firstName: string = '',
      public lastName: string = '',
      public secondName: string = '',
      public orgName: string = '',
      public copyCount: number = null,
      public protocolNumber: string = '',
      public protocolDate: any = new Date(),
      public mioNumber: string = '',
      public mioDate: any = null,
      public divisible: boolean = null
    ) {
    }
  }

  export class LandCategory {
    constructor(
      public id: number = null,
      public code: string = '',
      public nameRu: string = '',
      public nameKk: string = '',
    ) { }
  }
  export class FuncUse {
    constructor(
      public id: number = null,
      public code: string = '',
      public nameRu: string = '',
      public nameKk: string = '',
    ) { }
  }

  export class RightType {
    constructor(
      public id: number = null,
      public code: string = '',
      public nameRu: string = '',
      public nameKk: string = '',
    ) { }
  }

  export class AuctionInfo {
    constructor(
        public lotNumber: number = null,
        public lotID: any = null,
        public publishDate: any = new Date(),
        public addressRu: string = '',
        public addressKk: string = '',
        public descriptionRu: string = '',
        public descriptionKk: string = '',
        public sellerNameRu: string = '',
        public sellerNameKk: string = '',
        public iinBin: string = '',
        public installment: boolean = null,
        public installmentMonths: number = null,
        public landLimitsRu: string = '',
        public landLimitsKk: string = '',
        public noteRu: string = '',
        public noteKk: string = '',
        public auctionEndDate: any = new Date(),
        public rentConditionsRu: string = '',
        public rentConditionsKk: string = '',
        public cadastreCost: number = null,
        public initialCost: number = null,
        public landTaxCost: number = null,
        public warrantyCost: number = null,
        public auctionMethod: string = '',
        public auctionPlaceRu: string = '',
        public auctionPlaceKk: string = '',
        public auctionDate: any = new Date(),
        public stormWater: string = '',
    ) { }
    }

  export class AddressInfo {
    constructor(
      public id: number = null,
      public ateCode: string = null,
      public parentAteCode: string = null,
      public ateTypeCode: string = null,
      public ateNameRu: string = null,
      public ateNameKk: string = null,
      public toponimCode: string = null,
      public toponimTypeCode: string = null,
      public toponimNameRu: string = null,
      public toponimNameKk: string = null,
      public rca: string = null,
      public buildingTypeCode: string = null,
      public buildingNumber: string = null,
      public buildingPartRca: string = null,
      public buildingPartTypeCode: string = null,
      public buildingRca: string = null,
      public buildingPartNumber: string = null,
      public addressCode: string = null,
      public objectType: string = null,
      public addressNameRu: string = null,
      public addressNameKk: string = null,
    ) { }
  }

  export class PurposeUse {
    constructor(
      public id: number = null,
      public code: string = '',
      public nameRu: string = '',
      public nameKk: string = '',
    ) { }
  }
  export class OwnershipForm {
    constructor(
      public id: number = null,
      public code: string = '',
      public nameRu: string = '',
      public nameKk: string = '',
    ) { }
  }

}
