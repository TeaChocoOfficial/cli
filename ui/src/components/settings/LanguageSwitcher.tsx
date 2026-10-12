// -Path: 'ui\src\components\settings\LanguageSwitcher.tsx'
import Select from '../custom/Select';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'th-TH', label: 'ไทย', flag: '🇹🇭' },
    { code: 'ja-JP', label: '日本語', flag: '🇯🇵' },
    { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
] as const;

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const languageOptions = languages.map((lang) => ({
        value: lang.code,
        label: lang.label,
        icon: <span className="text-lg leading-none">{lang.flag}</span>,
    }));

    return (
        <Select
            value={i18n.language}
            options={languageOptions}
            onChange={(code) => i18n.changeLanguage(code.target.value)}
        />
    );
}
