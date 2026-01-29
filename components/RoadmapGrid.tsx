
import React from 'react';
import { Pillar, RoadmapItem } from '../types';
import PillarCard from './PillarCard';
import RoadmapItemCard from './RoadmapItemCard';

interface RoadmapGridProps {
    pillars: Pillar[];
    dates: string[];
    items: RoadmapItem[];
    onContextMenu: (e: React.MouseEvent, type: 'cell' | 'item', data: any) => void;
    onDragStart: (e: React.DragEvent, itemId: string) => void;
    onDrop: (e: React.DragEvent, dateIndex: number, columnIndex: number) => void;
}

const RoadmapGrid: React.FC<RoadmapGridProps> = ({ pillars, dates, items, onContextMenu, onDragStart, onDrop }) => {
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-x-4">
            {/* Date Timeline Column */}
            <div className="w-[100px] flex-shrink-0">
                <div className="h-[140px] mb-6 flex items-center justify-center font-bold text-slate-400 text-xs uppercase tracking-widest print-hidden">Date</div>
                <div className="relative">
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px border-l border-dashed border-slate-700"></div>
                    {dates.map((date, dateIndex) => {
                        const rowItemCount = items.filter(item => item.dateIndex === dateIndex).length;
                        return (
                            <div key={dateIndex} className="h-[120px] flex items-center justify-start relative">
                                <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10"></div>
                                <div className="pl-6 text-sm font-medium text-slate-500 flex items-center gap-1.5">
                                    <span>{date}</span>
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: rowItemCount }).map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

             {/* Pillars and Items Grid */}
            <div className="flex-1">
                {/* Pillar Headers */}
                <div className="grid grid-cols-4 gap-x-4 mb-6">
                    {pillars.map(pillar => (
                        <PillarCard key={pillar.id} pillar={pillar} />
                    ))}
                </div>
                {/* Items Grid */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-4 bg-transparent">
                        {dates.map((_, dateIndex) => (
                            <React.Fragment key={dateIndex}>
                                {pillars.map((pillar, columnIndex) => {
                                    const cellItems = items.filter(item => item.dateIndex === dateIndex && item.columnIndex === columnIndex);
                                    return (
                                        <div
                                            key={`${dateIndex}-${columnIndex}`}
                                            className={`p-2 h-[120px] relative ${columnIndex < pillars.length - 1 ? 'border-r' : ''} ${dateIndex < dates.length - 1 ? 'border-b' : ''} border-slate-800 border-dashed`}
                                            onContextMenu={(e) => onContextMenu(e, 'cell', { dateIndex, columnIndex })}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => onDrop(e, dateIndex, columnIndex)}
                                        >
                                            <div className="flex flex-col gap-2 h-full overflow-y-auto">
                                                {cellItems.map(item => (
                                                    <RoadmapItemCard key={item.id} item={item} onDragStart={onDragStart} onContextMenu={onContextMenu} pillarColor={pillar.color} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapGrid;