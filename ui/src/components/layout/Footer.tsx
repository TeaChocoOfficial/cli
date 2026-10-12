// -Path: 'ui\src\components\layout\Footer.tsx'
import { FaGithub } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="border-t border-border/50 bg-muted/30">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-surface-muted">
                        {t('footer.copyright')}
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/TeaChocoOfficial/cli"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex gap-2 text-neutral-muted hover:text-neutral-emphasis transition-colors text-sm items-center"
                        >
                            <FaGithub />
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
