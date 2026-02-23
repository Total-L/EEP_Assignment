
import React from 'react';
import { Pillar, RoadmapItem, PositionedItem } from '../types';
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

const ROW_HEIGHT = 120;
const ROW_GAP = 8;

function computePositionedItems(items: RoadmapItem[], totalRows: number): PositionedItem[] {
    const sorted = [...items].sort((a, b) => a.dateIndex - b.dateIndex);
    const tracks: RoadmapItem[][] = [];

    for (const item of sorted) {
        let placed = false;
        for (const track of tracks) {
            const last = track[track.length - 1];
            const lastEnd = Math.min(last.endDateIndex, totalRows - 1);
            if (lastEnd < item.dateIndex) {
                track.push(item);
                placed = true;
                break;
            }
        }
        if (!placed) tracks.push([item]);
    }

    const totalTracks = Math.max(tracks.length, 1);
    return tracks.flatMap((track, trackIndex) =>
        track.map(item => {
            const clampedEnd = Math.min(item.endDateIndex, totalRows - 1);
            return {
                ...item,
                top: item.dateIndex * ROW_HEIGHT + ROW_GAP / 2,
                height: (clampedEnd - item.dateIndex + 1) * ROW_HEIGHT - ROW_GAP,
                left: trackIndex / totalTracks,
                width: 1 / totalTracks,
            };
        })
    );
}

const RoadmapGrid: React.FC<RoadmapGridProps> = ({ pillars, dates, items, onContextMenu, onDragStart, onDrop }) => {

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="flex gap-x-0">
            {/* Date Timeline Column */}
            <div className="w-[120px] flex-shrink-0">
                <div className="h-[140px] mb-6 flex items-center justify-center font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest print-hidden">Date</div>
                <div className="relative">
                    <div className="absolute top-0 bottom-0 left-[85%] -translate-x-1/2 w-px border-l border-dashed border-slate-300 dark:border-slate-800"></div>
                    {dates.map((date, dateIndex) => (
                        <div key={dateIndex} className="h-[120px] flex items-center relative">
                            <div className="absolute left-[85%] -translate-x-1/2 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 z-10"></div>
                            <div className="w-full pr-6 flex items-center justify-end">
                                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 text-right whitespace-nowrap uppercase tracking-tighter">
                                    {date}
                                </span>
                            </div>
                        </div>
                    ))}
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

                {/* Grid with overlay */}
                <div className="relative border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Background grid — drop targets and borders only */}
                    <div className="grid grid-cols-4 bg-transparent">
                        {dates.map((_, dateIndex) => (
                            <React.Fragment key={dateIndex}>
                                {pillars.map((_, columnIndex) => (
                                    <div
                                        key={`${dateIndex}-${columnIndex}`}
                                        className={`h-[120px] relative ${columnIndex < pillars.length - 1 ? 'border-r' : ''} ${dateIndex < dates.length - 1 ? 'border-b' : ''} border-slate-200 dark:border-slate-800/60 border-dashed`}
                                        onContextMenu={(e) => onContextMenu(e, 'cell', { dateIndex, columnIndex })}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => onDrop(e, dateIndex, columnIndex)}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Overlay layer — absolutely positioned items per pillar column */}
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-4">
                        {pillars.map((pillar, columnIndex) => {
                            const columnItems = items.filter(i => i.columnIndex === columnIndex);
                            const positioned = computePositionedItems(columnItems, dates.length);
                            return (
                                <div key={columnIndex} className="relative">
                                    {positioned.map(item => (
                                        <div
                                            key={item.id}
                                            className="absolute pointer-events-auto"
                                            style={{
                                                top: item.top,
                                                height: item.height,
                                                left: `calc(${item.left * 100}% + 6px)`,
                                                width: `calc(${item.width * 100}% - 12px)`,
                                            }}
                                        >
                                            <RoadmapItemCard
                                                item={item}
                                                onDragStart={onDragStart}
                                                onContextMenu={onContextMenu}
                                                pillarColor={pillar.color}
                                                isSpanning={item.endDateIndex > item.dateIndex}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapGrid;
