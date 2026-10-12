// -Path: 'ui\src\components\layout\Section.tsx'
import { motion } from 'framer-motion';

export default function Section({
    children,
    className = '',
}: {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <motion.section
            transition={{ duration: 0.8 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ margin: '-100px' }}
            whileInView={{ opacity: 1, y: 0 }}
            style={{ transform: 'translateY(50px)' }}
            className={`min-h-[calc(100vh-80px)] flex flex-col justify-center items-center p-4 ${className}`}
        >
            {children}
        </motion.section>
    );
}
