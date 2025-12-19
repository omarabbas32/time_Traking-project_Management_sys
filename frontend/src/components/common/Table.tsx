import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

function Table<T extends { id: string | number }>({
    columns,
    data,
    onRowClick,
    isLoading,
    emptyMessage = 'No data available',
}: TableProps<T>) {
    return (
        <div className="w-full overflow-x-auto custom-scrollbar rounded-xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={clsx(
                                    "px-6 py-4 font-bold text-slate-700 whitespace-nowrap",
                                    column.className
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                {columns.map((_, j) => (
                                    <td key={j} className="px-6 py-4">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500 font-medium">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                className={clsx(
                                    "hover:bg-primary-50/30 transition-colors group cursor-default",
                                    onRowClick && "cursor-pointer"
                                )}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column, index) => (
                                    <td
                                        key={index}
                                        className={clsx(
                                            "px-6 py-4 text-slate-600 whitespace-nowrap transition-colors",
                                            column.className
                                        )}
                                    >
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : (item[column.accessor] as ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
