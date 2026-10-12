// -Path: 'ui\src\components\custom\Card.tsx'
import { motion } from 'framer-motion';

interface CardProps {
    icon?: React.ReactNode;
    title?: string;
    children: React.ReactNode;
    className?: string;
    description?: string;
}

export default function Card({
    icon,
    title,
    children,
    className,
    description,
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className={`group relative rounded-2xl border border-border bg-surface-overlay p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${className || ''}`}
        >
            {icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>
            )}
            {title && (
                <h3 className="mb-2 text-lg font-bold tracking-tight text-surface-foreground">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
            {children}
        </motion.div>
    );
}
