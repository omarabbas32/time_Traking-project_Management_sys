import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date | undefined, formatStr = 'MMM d, yyyy') => {
    if (!date) return '-';
    return format(new Date(date), formatStr);
};

export const formatRelativeDate = (date: string | Date | undefined) => {
    if (!date) return '-';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};
