export const STATUSES = {
  DRAFT: 'Черновик',
  APPLIED: 'Подано',
  REGISTERED: 'Зарегистрировано',
  ON_CONFIRM: 'На согласовании',
  IN_COMMUNAL: 'Передано в КП',
  FROM_COMMUNAL: 'Получено из КП',
  IN_ARCH: '',
  IN_PROGRESS: 'В обработке',
  APPROVED: 'Одобрено',
  REJECTED: 'Отказано',
  REWORK: 'В доработке',
  CONFIRMING: 'На согласовании',
  CONFIRMED: 'Согласовано',
  FINISHED: 'Завершено',
  WINNERS: 'Победители',
  PAYING: 'Ожидание оплаты',
  PAID: 'Оплачено',
  POSTPONED: 'Отложено',
  NOT_ANSWERED: 'Не отвечено'
};

export const STATUSES_KZ = {
  DRAFT: 'Черновик',
  APPLIED: 'Подано',
  REGISTERED: 'Тіркелді',
  ON_CONFIRM: 'Келісуде',
  IN_COMMUNAL: 'Передано в КП',
  FROM_COMMUNAL: 'Получено из КП',
  IN_ARCH: '',
  IN_PROGRESS: 'В обработке',
  APPROVED: 'Одобрено',
  REJECTED: 'Бас тартқан',
  REWORK: 'В доработке',
  CONFIRMING: 'Келісуде',
  CONFIRMED: 'Согласовано',
  FINISHED: 'Аяқталған',
  WINNERS: 'Жеңімпаздар',
  PAYING: 'Төлемді күту',
  PAID: 'Оплачено',
  POSTPONED: 'Отложено'
};


export const STATUSES_MEETINGAPP = {
  APPROVED: 'Одобрено',
  REJECTED: 'Отказано',
  POSTPONED: 'Отложено',
  WHATING: 'Ожидание'
};

export const STATUSES_FILTER = {
  APPLIED: 'Входящие',
  IN_PROGRESS: 'Выбор ЗУ',
  TO_SIGN: 'На подпись',
  SIGNED: 'Подписанные',
  CONFIRMING: 'На согласовании',
  CONFIRMED: 'Согласованные',
  ON_COMMISSION: 'На зем. комиссии',
  APPROVED: 'Завершенные',
  REJECTED: 'Отказы',
  ALL: 'Все'
};

export const STATUSES_FILTER_KZ = {
  APPLIED: 'Кіріс',
  IN_PROGRESS: 'Жер учаскесін таңдау',
  TO_SIGN: 'Қол қоюға өтінімдер',
  SIGNED: 'Қол қойылған',
  CONFIRMING: 'Келісуде',
  CONFIRMED: 'Келісілген',
  ON_COMMISSION: 'Жер комиссиясында',
  APPROVED: 'Аяқталған',
  REJECTED: 'Бас тарту',
  ALL: 'Барлық өтінімдер'
};

export const STATUSES_ENUM = {
  DRAFT: 'DRAFT',
  APPLIED: 'APPLIED',
  REGISTERED: 'REGISTERED',
  ON_CONFIRM: 'ON_CONFIRM',
  IN_COMMUNAL: 'IN_COMMUNAL',
  FROM_COMMUNAL: 'FROM_COMMUNAL',
  IN_ARCH: 'IN_ARCH',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REWORK: 'REWORK',
  CONFIRMING: 'CONFIRMING',
  CONFIRMED: 'CONFIRMED',
  FINISHED: 'FINISHED',
  WINNERS: 'WINNERS',
  PAYING: 'PAYING',
  PAID: 'PAID'
};

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  APP: 'ROLE_APP',
  ARCH: 'ROLE_ARCH',
  ARCH_DESIGN: 'ROLE_ARCH_DESIGN',
  ARCH_HEAD: 'ROLE_ARCH_HEAD',
  ARCH_TECH: 'ROLE_ARCH_TECH',
  AGREEMENTS: 'ROLE_AGREEMENTS',
  COM: 'ROLE_COM',
  COM_HEAD: 'ROLE_COM_HEAD',
  COM_CONFIRM: 'ROLE_COM_CONFIRM',
  CHAN: 'ROLE_CHAN',
  OZO: 'ROLE_OZO',
  OZO_HEAD: 'ROLE_OZO_HEAD',
  OZO_COM: 'ROLE_OZO_COMMISSION',
  ZKITON: 'ROLE_ZKITON',
  ZKITON_HEAD: 'ROLE_ZKITON_HEAD',
  ENG_NET_EDIT: 'ENG_NET_EDIT',
  ENG_NET: 'ENG_NET',
  CHAN_AKIMAT: 'ROLE_CHAN_AKIMAT',
  ENT_MANAGEMENT: 'ROLE_ENT_MANAGEMENT',
  ENT_MANAGEMENT_HEAD: 'ROLE_ENT_MANAGEMENT_HEAD',
  DUTY_MAP: 'ROLE_DUTY_MAP',
  GEO_TAX: 'ROLE_GEO_TAX',
  BPM_ARCH: 'ROLE_BPM_ARCH',
  BPM_OZO: 'ROLE_BPM_OZO',
  BPM_COM: 'ROLE_BPM_COM'
};

export const USER_TYPE = {
  INDIVIDUAL: 'INDIVIDUAL',
  LEGAL: 'LEGAL'
};

export const FILE_CATEGORIES = {
  MAIN: 'MAIN',
  APPROVED_TASK: 'APPROVED_TASK',
  LEGAL_DOCS: 'LEGAL_DOCS',
  LAND_PROVISION: 'LAND_PROVISION',
  OWNER_CONSENT: 'OWNER_CONSENT',
  OTHER_OWNERS_CONSENT: 'OTHER_OWNERS_CONSENT',
  OBJECT_TECH_PASSPORT: 'OBJECT_TECH_PASSPORT',
  TECH_PROJECT: 'TECH_PROJECT',
  DETAILED_PLAN_PROJECT: 'DETAILED_PLAN_PROJECT',
  VERTICAL_PLAN_MARKS: 'VERTICAL_PLAN_MARKS',
  ROAD_AND_STREET_INTERSECTION: 'ROAD_AND_STREET_INTERSECTION',
  EXTERNAL_ENGINEERING_NETWORK: 'EXTERNAL_ENGINEERING_NETWORK',
  SKETCH_PROJECT: 'SKETCH_PROJECT',
  IDENTIFICATION_DOCS: 'IDENTIFICATION_DOCS',
  ACT_VALUATION_CADASTRAL_VALUE: 'ACT_VALUATION_CADASTRAL_VALUE',
  STATE_ACT: 'STATE_ACT',
  CERTIFICATE_ABSENCE_REAL_ESTATE_INDIVIDUAL: 'CERTIFICATE_ABSENCE_REAL_ESTATE_INDIVIDUAL',
  INHERITANCE_CERTIFICATE: 'INHERITANCE_CERTIFICATE',
  ELECTRONIC_COPY: 'ELECTRONIC_COPY',
  FILES_APPROVED: 'FILES_APPROVED',
  FILES_REJECTED: 'FILES_REJECTED',
  FILES_AGREEMENT: 'FILES_AGREEMENT',
  FILES_ADDRESS: 'FILES_ADDRESS',
  APPLICANT_REJECTED: 'APPLICANT_REJECTED',
  SEND_ZU_PROJECT: 'SEND_ZU_PROJECT',
  COMMISSION_CONCLUSION: 'COMMISSION_CONCLUSION'
};

export const APP_FILTER = {
  ALL: 'ALL',
  APPLIED: 'APPLIED',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_COMMUNAL: 'IN_COMMUNAL',
  FROM_COMMUNAL: 'FROM_COMMUNAL',
  TO_SIGN: 'TO_SIGN',
  SIGNED: 'SIGNED',
  CONFIRMING: 'CONFIRMING',
  CONFIRMED: 'CONFIRMED',
  ON_COMMISSION: 'ON_COMMISSION',
  FROM_COMMISSION: 'FROM_COMMISSION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ON_CONFIRM: 'ON_CONFIRM',
  WINNERS: 'WINNERS',
  PAYING: 'PAYING',
  PAID: 'PAID',
  APPROVED_REJECTED: 'APPROVED_REJECTED',
  NUMERATION: 'NUMERATION',
  ON_CLARIFICATION: 'ON_CLARIFICATION'
};

export const APP_DATE_FILTERS = {
  PLAN_END_DATE: 'PLAN_END_DATE'
};

export const AUCTION_WINNERS = {
  WINNER: 'Победитель 1',
  WINNER2: 'Победитель 2',
  NONE: 'Не установлен'
};

export const AUCTION_WINNERS_ENUM = {
  WINNER: 'WINNER',
  WINNER2: 'WINNER2',
  NONE: 'NONE'
};

export const SearchOperation = [
  {nameRu: 'Больше', nameEn: 'GREATER_THAN'},
  {nameRu: 'Меньше', nameEn: 'LESS_THAN'},
  {nameRu: 'Между', nameEn: 'BETWEEN'},
  {nameRu: 'Не равно', nameEn: 'NOT_EQUAL'},
  {nameRu: 'Равно', nameEn: 'EQUAL'},
  {nameRu: 'Содержит', nameEn: 'MATCH'},
];

export const SpecregStatus = [
  {id: 'IN_ORDER', name: 'В очереди'},
  {id: 'RECEIVED', name: 'Получил'},
  {id: 'REFUSED', name: 'Отказался'},
  {id: 'DIED', name: 'Умер'},
  {id: 'MIGRATED', name: 'Мигрировал'},
  {id: 'DUPLICATED', name: 'Дубликат'},
];

export const SpecregJournalStatus = [
  {id: 'ADD', name: 'Добавил'},
  {id: 'EDIT', name: 'Редактировал'},
  {id: 'EXCLUDE', name: 'Исключил'},
  {id: 'DELETE', name: 'Удалил'},
  {id: 'RENUMERATE', name: 'Сделал пересчет'},
  {id: 'ROLLBACK', name: 'Вернул'}
];

export const LINKS_APZ_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/files',
  '/create-app/electrification',
  '/create-app/water-supply',
  '/create-app/sewerage',
  '/create-app/heat-supply',
  '/create-app/gas-supply',
  '/create-app/sign'
];
export const LINKS_OZO_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/files',
  '/create-app/sign'
];
export const LINKS_GAS_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/gas-supply',
  '/create-app/files',
  '/create-app/sign'
];
export const LINKS_SU_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/water-supply',
  '/create-app/files',
  '/create-app/sign'
];
export const LINKS_TEPLO_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/heat-supply',
  '/create-app/files',
  '/create-app/sign'
];

export const LINKS_IJS_NAVIGATOR = [
  '/create-app/application',
  '/create-app/files',
  '/create-app/sign'
];

export const LINKS_SPECREG_NAVIGATOR = [
  '/create-app/application',
  '/create-app/object',
  '/create-app/sign'
];


export const LINKS_ZEMKOM_NAVIGATOR = [
  '/create-app/application',
  '/create-app/land-projector',
  '/create-app/object',
  '/create-app/files',
  '/create-app/sign'
];
