// -Path: 'ui\src\components\custom\Button.tsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
    ghost: 'bg-transparent hover:bg-muted text-foreground',
    primary:
        'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    secondary: 'bg-muted text-foreground hover:bg-accent',
};

const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
};

export default function Button({
    size = 'md',
    children,
    className,
    variant = 'primary',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
}
