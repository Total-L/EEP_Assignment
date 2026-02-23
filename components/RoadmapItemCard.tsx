
import React from 'react';
import { RoadmapItem, User, Status } from '../types';

interface RoadmapItemCardProps {
    item: RoadmapItem;
    pillarColor: 'salmon' | 'gold' | 'emerald' | 'azure';
    onDragStart: (e: React.DragEvent, itemId: string) => void;
    onContextMenu: (e: React.MouseEvent, type: 'item', data: { item: RoadmapItem }) => void;
    isSpanning?: boolean;
}

const pillarColorMap = {
    salmon: 'bg-pillar-salmon',
    gold: 'bg-pillar-gold',
    emerald: 'bg-pillar-emerald',
    azure: 'bg-pillar-azure',
};
const itemColorClasses = {
    salmon: {
        bg: 'bg-pillar-salmon/[0.03]',
        border: 'border-pillar-salmon/20',
        text: 'text-pillar-salmon'
    },
    gold: {
        bg: 'bg-pillar-gold/[0.03]',
        border: 'border-pillar-gold/20',
        text: 'text-pillar-gold'
    },
    emerald: {
        bg: 'bg-pillar-emerald/[0.03]',
        border: 'border-pillar-emerald/20',
        text: 'text-pillar-emerald'
    },
    azure: {
        bg: 'bg-pillar-azure/[0.03]',
        border: 'border-pillar-azure/20',
        text: 'text-pillar-azure'
    },
};
const statusColorMap = {
    [Status.Todo]: 'bg-yellow-500',
    [Status.InProgress]: 'bg-blue-500',
    [Status.Done]: 'bg-green-500',
    [Status.Delayed]: 'bg-red-500',
};

const hoverBorderColorMap = {
    salmon: 'hover:border-pillar-salmon/30',
    gold: 'hover:border-pillar-gold/30',
    emerald: 'hover:border-pillar-emerald/30',
    azure: 'hover:border-pillar-azure/30',
};


const AssigneeAvatars: React.FC<{ assignees: User[] }> = ({ assignees }) => {
    if (assignees.length === 0) return null;
    return (
        <div className="flex -space-x-1">
            {assignees.map(user => (
                <img key={user.id} alt={user.name} className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-background-dark object-cover" src={user.avatarUrl} />
            ))}
        </div>
    );
};

const ProgressBar: React.FC<{ progress: number; color: string; }> = ({ progress, color }) => (
    <div className="w-16 h-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${progress}%` }}></div>
    </div>
);

const getEffectiveStatus = (item: RoadmapItem): Status => {
    // Auto-detect delayed status: if end date has passed and status is not Done, mark as Delayed
    if (item.status === Status.Done) return Status.Done;
    
    const endDate = new Date(item.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (endDate < today && item.status !== Status.Done) {
        return Status.Delayed;
    }
    
    return item.status;
};

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item, pillarColor, onDragStart, onContextMenu, isSpanning }) => {
    const hoverBorderColor = hoverBorderColorMap[pillarColor];
    const effectiveStatus = getEffectiveStatus(item);
    const progressBarColor = statusColorMap[effectiveStatus];
    const itemColors = itemColorClasses[pillarColor];

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onContextMenu={(e) => onContextMenu(e, 'item', { item })}
            className={`relative p-3 rounded-xl border ${itemColors.border} ${itemColors.bg} ${hoverBorderColor} transition-all cursor-pointer w-full text-left overflow-hidden ${isSpanning ? 'h-full flex flex-col' : ''}`}
        >
            {/* Left-edge vertical progress bar for spanning items */}
            {isSpanning && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-l-xl overflow-hidden">
                    <div className={`${progressBarColor} w-full transition-all`} style={{ height: `${item.progress}%` }} />
                </div>
            )}

            <div className={isSpanning ? 'pl-2 flex flex-col flex-1' : ''}>
                <p className={`text-xs font-semibold mb-2 leading-tight ${itemColors.text}`}>{item.title}</p>
                {item.description && <p className={`text-[10px] ${itemColors.text}/70 mb-2`}>{item.description}</p>}

                {isSpanning && (
                    <p className={`text-[10px] ${itemColors.text}/60 mb-2`}>
                        {item.startDate} → {item.endDate}
                    </p>
                )}

                <div className={`flex items-center justify-between ${isSpanning ? 'mt-auto' : ''}`}>
                    <AssigneeAvatars assignees={item.assignees} />

                    {item.status === 'Done' && (
                        <span className={`text-[10px] ${itemColors.text} uppercase font-bold tracking-tighter`}>Done</span>
                    )}

                    {item.tag && (
                        <span className={`inltems-center px-2 py-0.5 rounded text-[10px] font-medium ${itemColors.text}/80 border ${itemColors.border}`}>{item.tag}</span>
                    )}

                    {!isSpanning && item.progress > 0 && <ProgressBar progress={item.progress} color={progressBarColor} />}
                </div>
            </div>
        </div>
    );
};

export default RoadmapItemCard;
