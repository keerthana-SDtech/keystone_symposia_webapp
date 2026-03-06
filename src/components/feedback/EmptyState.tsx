interface EmptyStateProps {
    message: string;
    className?: string;
}

export function EmptyState({ message, className = '' }: EmptyStateProps) {
    return (
        <div className={`py-12 flex items-center justify-center ${className}`}>
            <p className="text-gray-500 text-sm">{message}</p>
        </div>
    );
}
