export interface Wallpaper {
  date: string;
  url: string;
  copyright: string;
}

export type CountryCode = 'en-US' | 'zh-CN' | 'ja-JP' | 'en-GB' | 'en-SG';

export const COUNTRIES: Record<CountryCode, string> = {
  'en-US': 'United States',
  'zh-CN': 'China',
  'ja-JP': 'Japan',
  'en-GB': 'United Kingdom',
  'en-SG': 'Global',
};
