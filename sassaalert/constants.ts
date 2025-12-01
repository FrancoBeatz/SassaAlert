import { GrantType, PaydayDate } from './types';

// Mock calculation for next payment dates (usually 2nd, 3rd, 4th of month)
export const getNextPayDates = (): PaydayDate[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Logic: If we are past the 5th, show next month dates
  const targetMonth = today.getDate() > 5 ? currentMonth + 1 : currentMonth;
  const targetYear = today.getDate() > 5 && currentMonth === 11 ? currentYear + 1 : currentYear;

  const monthName = new Date(targetYear, targetMonth, 1).toLocaleString('default', { month: 'long' });

  return [
    {
      grantType: GrantType.OLD_AGE,
      date: `${monthName} 2, ${targetYear}`,
      estimated: true
    },
    {
      grantType: GrantType.DISABILITY,
      date: `${monthName} 3, ${targetYear}`,
      estimated: true
    },
    {
      grantType: GrantType.CHILD_SUPPORT,
      date: `${monthName} 4, ${targetYear}`,
      estimated: true
    },
     {
      grantType: GrantType.SRD,
      date: `${monthName} 25, ${targetYear}`,
      estimated: true
    }
  ];
};

export const MOCK_DB_KEY = 'sassa_users_db';