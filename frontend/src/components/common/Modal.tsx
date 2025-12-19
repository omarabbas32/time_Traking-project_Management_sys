import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            <div className={clsx(
                "relative w-full bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up bg-clip-padding border border-white/20",
                sizes[size]
            )}>
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors rounded-xl"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-8 py-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end space-x-3 rounded-b-3xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
