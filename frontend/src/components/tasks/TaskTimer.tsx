import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import Button from '../common/Button';
import { useTimer } from '../../hooks/useTasks';
import { clsx } from 'clsx';

interface TaskTimerProps {
    taskId: string;
    isAssignedToMe: boolean;
    status: string;
    initialProductiveMinutes: number;
}

const TaskTimer: React.FC<TaskTimerProps> = ({
    taskId,
    isAssignedToMe,
    status,
    initialProductiveMinutes
}) => {
    const [isRunning, setIsRunning] = useState(status === 'in_progress');
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const { startTimer, stopTimer } = useTimer(taskId);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        startTimer.mutate();
        setIsRunning(true);
    };

    const handleStop = () => {
        stopTimer.mutate();
        setIsRunning(false);
        setElapsedSeconds(0);
    };

    if (!isAssignedToMe) {
        return (
            <div className="flex items-center space-x-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock size={16} />
                <span className="text-sm font-bold">{Math.floor(initialProductiveMinutes / 60)}h {initialProductiveMinutes % 60}m</span>
            </div>
        );
    }

    return (
        <div className={clsx(
            "flex items-center space-x-4 px-4 py-2 rounded-2xl border transition-all duration-300 shadow-sm",
            isRunning ? "bg-primary-50 border-primary-200" : "bg-white border-slate-200"
        )}>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Running</span>
                <span className={clsx(
                    "text-xl font-black tabular-nums tracking-tighter",
                    isRunning ? "text-primary-700" : "text-slate-700"
                )}>
                    {formatTime(elapsedSeconds)}
                </span>
            </div>

            <div className="flex items-center space-x-2">
                {!isRunning ? (
                    <Button
                        size="sm"
                        onClick={handleStart}
                        className="rounded-full w-10 h-10 p-0 shadow-lg shadow-primary-500/20"
                        isLoading={startTimer.isPending}
                    >
                        <Play size={18} fill="currentColor" />
                    </Button>
                ) : (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={handleStop}
                        className="rounded-full w-10 h-10 p-0 shadow-lg shadow-red-500/20"
                        isLoading={stopTimer.isPending}
                    >
                        <Square size={18} fill="currentColor" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TaskTimer;
