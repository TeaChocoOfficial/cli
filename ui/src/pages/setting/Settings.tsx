// -Path: 'ui\src\pages\setting\Settings.tsx'
import { useTranslation } from 'react-i18next';
import Card from '../../components/custom/Card';
import Select from '../../components/custom/Select';
import { dockviewThemes } from '../workspace/dockview/theme';
import ThemeToggle from '../../components/settings/ThemeToggle';
import { FaPalette, FaCode, FaLanguage } from 'react-icons/fa6';
import { useDockviewThemeStore } from '../../stores/dockviewThemeStore';
import LanguageSwitcher from '../../components/settings/LanguageSwitcher';

const dockviewThemeOptions = Object.keys(dockviewThemes).map((key) => ({
    value: key,
    label: key.replace(/([A-Z])/g, ' $1').trim(),
}));

export default function Settings() {
    const { t } = useTranslation();
    const { theme: dockviewTheme, setTheme: setDockviewTheme } =
        useDockviewThemeStore();

    return (
        <>
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                    <span className="linear-text">{t('setting.title')}</span>
                </h1>
            </div>

            <div className="max-w-4xl mx-auto w-full grid gap-6">
                <Card
                    icon={<FaPalette />}
                    title={t('setting.appTheme', 'ธีมแอป')}
                    description={t(
                        'setting.appThemeDesc',
                        'สลับโหมดสว่าง/มืด ของแอปพลิเคชัน',
                    )}
                >
                    <div className="mt-4">
                        <ThemeToggle />
                    </div>
                </Card>

                <Card
                    icon={<FaLanguage />}
                    title={t('setting.language', 'ภาษา')}
                    description={t(
                        'setting.languageDesc',
                        'เลือกภาษาที่ต้องการใช้งาน',
                    )}
                >
                    <div className="mt-4">
                        <LanguageSwitcher />
                    </div>
                </Card>

                <Card
                    icon={<FaCode />}
                    title={t('setting.dockviewTheme', 'ธีม Dockview')}
                    description={t(
                        'setting.dockviewThemeDesc',
                        'เลือกธีมสำหรับพื้นที่ทำงานและแผงต่างๆ',
                    )}
                >
                    <div className="mt-4">
                        <Select
                            value={dockviewTheme}
                            options={dockviewThemeOptions}
                            onChange={(event) =>
                                setDockviewTheme(event.target.value)
                            }
                        />
                    </div>
                </Card>
            </div>
        </>
    );
}
