type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
};

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    return (
        <div
            className={`animate-spin rounded-full border-b-2 border-primary ${SIZE_CLASSES[size]} ${className}`}
        />
    );
}
