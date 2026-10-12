// -Path: 'ui\src\types\language.ts'
/**
 * Language Enum
 * ใช้สำหรับกำหนดภาษาที่รองรับในระบบ
 */
export enum Language {
    EN = 'en-US',
    TH = 'th-TH',
}

export type LanguageType = (typeof Language)[keyof typeof Language];
