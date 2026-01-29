
import React from 'react';
import { RoadmapItem, User } from '../types';

interface RoadmapItemCardProps {
    item: RoadmapItem;
    pillarColor: 'salmon' | 'gold' | 'emerald' | 'azure';
    onDragStart: (e: React.DragEvent, itemId: string) => void;
    onContextMenu: (e: React.MouseEvent, type: 'item', data: { item: RoadmapItem }) => void;
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
                <img key={user.id} alt={user.name} className="w-5 h-5 rounded-full ring-2 ring-background-dark object-cover" src={user.avatarUrl} />
            ))}
        </div>
    );
};

const ProgressBar: React.FC<{ progress: number; color: string; }> = ({ progress, color }) => (
    <div className="w-16 h-1 bg-slate-800/50 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${progress}%` }}></div>
    </div>
);

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item, pillarColor, onDragStart, onContextMenu }) => {
    const progressBarColor = pillarColorMap[pillarColor];
    const hoverBorderColor = hoverBorderColorMap[pillarColor];
    
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onContextMenu={(e) => onContextMenu(e, 'item', { item })}
            className={`p-3 rounded-xl border border-slate-800 bg-slate-900 ${hoverBorderColor} transition-all cursor-pointer w-full text-left`}
        >
            <p className="text-xs font-semibold mb-2 leading-tight">{item.title}</p>
            {item.description && <p className="text-[10px] text-slate-500 mb-2">{item.description}</p>}
            
            <div className="flex items-center justify-between">
                <AssigneeAvatars assignees={item.assignees} />

                {item.status === 'Done' && (
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Done</span>
                )}
                
                {item.tag && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-400/5 text-red-400 border border-red-400/20">{item.tag}</span>
                )}

                {item.progress > 0 && <ProgressBar progress={item.progress} color={progressBarColor} />}
            </div>
        </div>
    );
};

export default RoadmapItemCard;
