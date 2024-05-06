export interface Person {
  firstname: string;
  gender: string;
  iin: string;
  nationalty: string;
  personId: number;
  regAddressBuilding: string;
  regAddressCity: string;
  regAddressCorpus: string;
  regAddressCountryId: string;
  regAddressDistrictName: string;
  regAddressFlat: string;
  regAddressRegion: string;
  regAddressStreet: string;
  regionKato: string;
  secondname: string;
  surame: string;
}

export interface Address {
  id: number;
  rkaCode: string;
  katoCode: string;
  geonimCode: string;
  buildingTypeCode: string;
  roomTypeCode: string;
  street1Type: string;
  street1: string;
  street2Type: string;
  street2: string;
  buildingNumber: string;
  roomNumber: string;
  regionKato?: any;
}

export interface Classifier {
  id: number;
  regOrgan: string;
  shortnameRu: string;
  shortnameKz: string;
  orgFormCode: string;
  orgLegalFormCode: string;
  eduMethod: string;
  ownershipCode: string;
  iscommercialOrg: string;
  isbusinessEntity: string;
  busEntityTypeCode: string;
  issubOrg: string;
  isinterOrg: string;
  participForeignInvest: string;
  participStatelessPerson: string;
  expectedNumberEmp: string;
  bin: string;
  field1: string;
  field2: string;
  regionKato?: any;
}

export interface HeaderOrg {
  id: number;
  isResident: string;
  incorpCountryCode: string;
  bin: string;
  regNumberIncorpCountry: string;
  taxNumberIncorpCountry: string;
  regDate: string;
  fullname: string;
  regionKato?: any;
}

export interface Leader {
  id: number;
  citizenshipRelCode: string;
  citizenshipCode: string;
  iin: string;
  taxNumberIncorpCountry: string;
  surname: string;
  firstname: string;
  secondname: string;
  regionKato?: any;
}

export interface Oked {
  id: number;
  code: string;
  isMain: string;
  nameRu: string;
  nameKz: string;
  regionKato?: any;
}

export interface Entity {
  id: number;
  bin: string;
  subjectStatusCode: string;
  registrationActionCode: string;
  registrationActionDate: string;
  fullnameRu: string;
  fullnameKz: string;
  rnn: string;
  phone: string;
  email: string;
  regionKato?: any;
  field1?: any;
  address: Address[];
  classifier: Classifier[];
  founderFl: any[];
  founderUl: any[];
  headerOrg: HeaderOrg[];
  leader: Leader[];
  okeds: Oked[];
}

export interface Realty {
  rdNo: string;
  region: string;
  district: string;
  rightholder: string;
  iinBin: string;
  objType: string;
  kadNo: string;
  target: string;
  address: string;
  rightRegDate: string;
  rightDoc: string;
  interested: string;
  interestedIin?: any;
  pledgeRegDate: string;
  regionKato?: any;
}

export interface SearchGBDOption {
  title: string;
  value: string;
}

export interface ZagsDeath {
  id: number;
  numberAkt: string;
  personIin: string;
  personSurname: string;
  personName: string;
  personSecondname: string;
  personBirthDate?: any;
  zagsId: string;
  regDate: string;
}

export interface ZagsChangeFio {
  id: number;
  numberAkt: string;
  iin: string;
  surname: string;
  name: string;
  secondname: string;
  birthDate?: any;
  zagsId: string;
  regDate: string;
  personIin?: any;
}

export interface ZagsBirth {
  id: number;
  numberAkt: string;
  childIin: string;
  childSurname: string;
  childName: string;
  childSecondname: string;
  childBirthDate: string;
  childBirthCountryId: string;
  childBirthDistrictId: string;
  childBirthRegionId: string;
  motherIin: string;
  motherSurname: string;
  motherName: string;
  motherSecondname: string;
  motherBirthDate: string;
  fatherIin: string;
  fatherSurname: string;
  fatherName: string;
  fatherSecondname: string;
  fatherBirthDate: string;
  zagsId: string;
  regDate: string;
}
