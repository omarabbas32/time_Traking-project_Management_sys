import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    headerAction?: ReactNode;
    footer?: ReactNode;
    noPadding?: boolean;
}

const Card = ({ children, title, subtitle, headerAction, footer, noPadding, className, ...props }: CardProps) => {
    return (
        <div
            className={twMerge(
                'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col',
                className
            )}
            {...props}
        >
            {(title || subtitle || headerAction) && (
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
                        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                    {headerAction && <div className="ml-4">{headerAction}</div>}
                </div>
            )}

            <div className={twMerge('flex-1', !noPadding && 'p-6')}>
                {children}
            </div>

            {footer && (
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
