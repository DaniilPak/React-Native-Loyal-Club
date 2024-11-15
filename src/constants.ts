import { Dimensions } from 'react-native';

/**
 * ? This file used for holding colors, and offsets like
 * ? width, height. It's preferable to use this file
 * ? everywhere, so it'll be easy to customize the whole
 * ? app
 *
 */
/**
 * * IOS system colors
 */

const { width, height } = Dimensions.get('screen');

const Con = {
  width,
  height,
  AppleBackgroundDark: '#000',
  AppleBackground: '#EFEFF4',
  ApplePurpleLight: 'rgb(175, 82, 222)',
  ApplePurpleDark: 'rgb(192, 90, 242)',
  AppleBlueLight: 'rgb(0, 122, 255)',
  AppleBlueDark: 'rgb(10, 132, 255)',
  AppleRedLight: 'rgb(255, 59, 48)',
  AppleRedDark: 'rgb(255, 69, 58)',
  AppleYellowLight: 'rgb(255, 204, 0)',
  AppleYellowDark: 'rgb(255, 214, 10)',
  AppleGreenLight: 'rgb(52, 199, 89)',
  AppleGreenDark: 'rgb(48, 209, 88)',
  AppleGrayLight: 'rgb(174, 174, 178)',
  AppleGrayDark: 'rgb(99, 99, 102)',
  AppleGray6: 'rgb(242, 242, 247)',
  AppleOrange: 'rgb(255, 149, 0)',
  LoyalClubColor: '#0d322b',

  // LOCAL
  // 'http://localhost:3000/api',
  // 'ws://localhost:8080',

  // AWS
  // http://18.118.84.185:3000/api
  // ws://18.118.84.185:9000
  // ws://18.118.84.185:9001

  // New domain http://18.191.146.59

  api: 'http://18.191.146.59:3000/api',
  ws: 'ws://18.191.146.59:9000',
  ws2: 'ws://18.191.146.59:9001',
  API_AUTH_DATA_KEY: 'authdata',
  PHONE_ASYNC_KEY: 'phone',
  PASSWORD_ASYNC_KEY: 'password',
  DEBUG: false,
  privacyPolicy: "http://18.191.146.59:3000/images/image-1726815458918.html",

  // Codes
  updateChatCode: 'updatechatcode',

  iconSize: 25,
  iconColor: 'rgb(0, 122, 255)',

  borderSize: 220,

  /// Used in Qr Card, HalfScreenButtons, LoyaltyCard
  universalBorderRadius: 10,

  homeScanner: 'HomeScanner',
  qrDetail: 'QRDetail',
  myLoyaltyCards: 'MyLoyaltyCards',
  businessSettings: 'BusinessSettings',
  successPayment: 'SuccessPayment',
  successAbonnementCreation: 'SuccessAbonnementCreation',
  receiptDetails: 'ReceiptDetails',
  manageWorkers: 'ManageWorkers',
  addWorkerScanner: 'AddWorkerScanner',
  accountDeletion: 'AccountDeletion',
  announcements: 'Announcements',
  scanQR: 'Scan QR',
  history: 'History',
  abonnements: 'Abonnements',
  userAbonnements: 'UserAbonnements',
  scanAbonnement: 'ScanAbonnement',
  scanAbonnementDetails: 'ScanAbonnementDetails',
  createAbonnement: 'CreateAbonnement',
  createAbonnementDetails: 'CreateAbonnementDetails',
  allAbonnements: 'AllAbonnements',
  abonnementVisitConfirmation: 'AbonnementVisitConfirmation',
  successVisitCreation: 'SuccessVisitCreation',
  abonnementCompleteInfo: 'AbonnementCompleteInfo',
  rewardedActions: 'RewardedActions',
  statistics: 'Statistics',
  vouchers: 'Vouchers',
  voucherCreation: 'VoucherCreation',
  applyVoucher: 'ApplyVoucher',
  conversation: 'Conversation',
  loading: 'Loading',
  auth: 'Auth',
  confirmation: 'Confirmation',
  registration: 'Registration',
  chat: 'Chat',
  qrCard: 'QR card',
  setttings: 'Setttings',

  // Titles
  homeScannerTitle: 'LoyalClub',
  qrDetailTitle: 'QRDetail',
  myLoyaltyCardsTitle: 'Мои карты',
  businessSettingsTitle: 'Бизнес',
  successPaymentTitle: 'Успешная оплата',
  successAbonnementCreationTitle: 'Успешное создание',
  receiptDetailsTitle: 'Детали платежа',
  manageWorkersTitle: 'Сотрудники',
  addWorkerScannerTitle: 'Добавить сотрудника',
  accountDeletionTitle: 'Удаление Аккаунта',
  announcementsTitle: 'Анонсы',
  scanQRTitle: 'Сканировать QR',
  historyTitle: 'История',
  abonnementsTitle: 'Сертификаты и абонементы',
  userAbonnementsTitle: 'Мои сертификаты и абонементы',
  scanAbonnementTitle: 'Сканировать',
  scanAbonnementDetailsTitle: 'Детали',
  createAbonnementTitle: 'Создать',
  createAbonnementDetailsTitle: 'Создание',
  allAbonnementsTitle: 'Все сертификаты и абонементы',
  abonnementVisitConfirmationTitle: 'Подтверждение визита',
  successVisitCreationTitle: 'Успешное создание визита',
  abonnementCompleteInfoTitle: 'Подробности',
  rewardedActionsTitle: 'Получить бонусы',
  statisticsTitle: 'Статистика',
  vouchersTitle: 'Ваучеры',
  voucherCreationTitle: 'Создание ваучера',
  applyVoucherTitle: 'Ввести промокод',
  chatTitle: 'Сообщения',
  qrCardTitle: 'Мой QR',
  setttingsTitle: 'Аккаунт',
};

export default Con;
