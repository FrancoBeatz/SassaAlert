export enum GrantType {
  OLD_AGE = 'Old Age Grant',
  DISABILITY = 'Disability Grant',
  CHILD_SUPPORT = 'Child Support Grant',
  SRD = 'Social Relief of Distress (SRD)',
  FOSTER_CHILD = 'Foster Child Grant'
}

export interface UserSubscription {
  id: string;
  name: string;
  phone: string;
  grantType: GrantType;
  subscribedAt: string;
}

export interface PaydayDate {
  grantType: GrantType;
  date: string; // ISO Date string
  estimated: boolean;
}

export interface MockSms {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
}