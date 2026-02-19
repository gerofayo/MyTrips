declare module "country-tz-currency" {
  export interface Country {
    countryName: string;
    countryNumber: string;
    alpha3: string;
    areaCode: string;
    currencyCode: string;
    timeZone: string[]; 
  }

  export interface Timezone {
    id: string;
    name: string;
    offset: string;
    // ... otros campos si necesito
  }

  export interface Currency {
    code: string;
    symbol: string;
    name: string;
  }

  interface CountryTzCurrency {
    getAllCountries(): Record<string, Country>;
    getAllTimezones(): Record<string, any>;
    getAllCurrencies(): Record<string, any>;
    getCountryByCode(code: string): Country | undefined;
    getCurrencyByCode(code: string): any;
    getCurrencyByCountryCode(code: string): any;
    getTzById(timezoneId: string): any;
    getTzIdsByCountryCode(code: string): string[] | undefined;
    getTzsByCountryCode(code: string): any[] | undefined;
  }

  const instance: CountryTzCurrency;
  export default instance;

  export function getAllCountries(): Record<string, Country>;
  export function getCountryByCode(code: string): Country | undefined;
  export function getAllCurrencies(): Record<string, any>;
  export function getTzIdsByCountryCode(code: string): string[] | undefined;
}