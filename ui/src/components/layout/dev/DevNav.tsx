// -Path: 'ui\src\components\layout\dev\DevNav.tsx'
import env from '../../../secure/env';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DevNav() {
    const { t } = useTranslation();

    return (
        <nav className="sticky top-0 z-50 border-b border-border/50 bg-surface/60 backdrop-blur-xl h-10">
            <div className="px-1 h-full flex items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-120">
                        <img
                            src={`${env.BASE_URL}TeaChoco-Developer-logo.png`}
                            className="w-full h-full"
                        />
                    </div>
                </Link>
            </div>
        </nav>
    );
}
