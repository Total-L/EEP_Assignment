
import React from 'react';
import { RoadmapItem, User } from '../types';

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

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item, pillarColor, onDragStart, onContextMenu, isSpanning }) => {
    const progressBarColor = pillarColorMap[pillarColor];
    const hoverBorderColor = hoverBorderColorMap[pillarColor];

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onContextMenu={(e) => onContextMenu(e, 'item', { item })}
            className={`relative p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${hoverBorderColor} transition-all cursor-pointer w-full text-left overflow-hidden ${isSpanning ? 'h-full flex flex-col' : ''}`}
        >
            {/* Left-edge vertical progress bar for spanning items */}
            {isSpanning && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-l-xl overflow-hidden">
                    <div className={`${progressBarColor} w-full transition-all`} style={{ height: `${item.progress}%` }} />
                </div>
            )}

            <div className={isSpanning ? 'pl-2 flex flex-col flex-1' : ''}>
                <p className="text-xs font-semibold mb-2 leading-tight text-slate-900 dark:text-white">{item.title}</p>
                {item.description && <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{item.description}</p>}

                {isSpanning && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-600 mb-2">
                        {item.startDate} → {item.endDate}
                    </p>
                )}

                <div className={`flex items-center justify-between ${isSpanning ? 'mt-auto' : ''}`}>
                    <AssigneeAvatars assignees={item.assignees} />

                    {item.status === 'Done' && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-tighter">Done</span>
                    )}

                    {item.tag && (
                        <span className="inltems-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-400/5 dark:bg-red-400/5 text-red-600 dark:text-red-400 border border-red-400/20">{item.tag}</span>
                    )}

                    {!isSpanning && item.progress > 0 && <ProgressBar progress={item.progress} color={progressBarColor} />}
                </div>
            </div>
        </div>
    );
};

export default RoadmapItemCard;
