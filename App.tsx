
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import RoadmapGrid from './components/RoadmapGrid';
import ContextMenu from './components/ContextMenu';
import ItemModal from './components/ItemModal';
import { RoadmapItem, ContextMenuState, ModalState } from './types';
import { PILLARS, DATES_WEEK, DATES_MONTH, DATES_QUARTER, INITIAL_ITEMS, USERS } from './constants';

const App: React.FC = () => {
    const [items, setItems] = useState<RoadmapItem[]>(INITIAL_ITEMS);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, type: 'cell', data: {} });
    const [modal, setModal] = useState<ModalState>({ visible: false, type: 'add', data: {} });
    const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('week');
    
    const closeContextMenu = useCallback(() => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    }, []);

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [closeContextMenu]);

    const handleContextMenu = (e: React.MouseEvent, type: 'cell' | 'item', data: any) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, type, data });
    };

    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        e.dataTransfer.setData("itemId", itemId);
    };

    const handleDrop = (e: React.DragEvent, dateIndex: number, columnIndex: number) => {
        const itemId = e.dataTransfer.getData("itemId");
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === itemId ? { ...item, dateIndex, columnIndex } : item
            )
        );
    };

    const handleAddItem = (data: { dateIndex: number, columnIndex: number }) => {
      const pillarId = PILLARS[data.columnIndex].id;
      setModal({ visible: true, type: 'add', data: { dateIndex: data.dateIndex, columnIndex: data.columnIndex, pillarId } });
      closeContextMenu();
    };

    const handleEditItem = (item: RoadmapItem) => {
      setModal({ visible: true, type: 'edit', data: { item } });
      closeContextMenu();
    };

    const handleDeleteItem = (item: RoadmapItem) => {
      setItems(prev => prev.filter(i => i.id !== item.id));
      closeContextMenu();
    }

    const handleSaveItem = (itemData: Omit<RoadmapItem, 'id'>, id?: string) => {
        if (id) {
            // Update
            setItems(prev => prev.map(item => item.id === id ? { ...itemData, id } : item));
        } else {
            // Add
            const newItem: RoadmapItem = {
                ...itemData,
                id: `item-${Date.now()}`,
            };
            setItems(prev => [...prev, newItem]);
        }
        setModal({ visible: false, type: 'add', data: {} });
    };

    const handleExport = () => {
        window.print();
    };

    const contextMenuItems = () => {
        if (contextMenu.type === 'cell') {
            return [{ label: 'Add New Item', action: () => handleAddItem(contextMenu.data as any) }];
        }
        if (contextMenu.type === 'item') {
            const item = (contextMenu.data as {item: RoadmapItem}).item;
            return [
                { label: 'Update Details', action: () => handleEditItem(item) },
                { label: 'Update Status', action: () => handleEditItem(item) },
                { label: 'Update Time', action: () => handleEditItem(item) },
                { label: 'Update Assignee', action: () => handleEditItem(item) },
                { label: 'Delete Item', action: () => handleDeleteItem(item), isDestructive: true },
            ];
        }
        return [];
    };

    const getDatesForViewMode = () => {
        switch (viewMode) {
            case 'month':
                return DATES_MONTH;
            case 'quarter':
                return DATES_QUARTER;
            case 'week':
            default:
                return DATES_WEEK;
        }
    };

    const currentDates = getDatesForViewMode();

    return (
        <div className="dark">
            <Header users={USERS} viewMode={viewMode} setViewMode={setViewMode} onExport={handleExport} />
            <main className="max-w-[1600px] mx-auto p-6">
                <RoadmapGrid
                    pillars={PILLARS}
                    dates={currentDates}
                    items={items}
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                />
            </main>
            <div className="fixed bottom-6 right-6 flex items-center gap-6 print-hidden">
                <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl z-50 flex flex-col gap-2 border border-white/5 min-w-[220px]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Roadmap Status</span>
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pillar-emerald"></span><span className="text-[11px] font-bold text-slate-300">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span><span className="text-[11px] font-bold text-slate-300">Todo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[11px] font-bold text-slate-300">Delayed</span>
                        </div>
                    </div>
                </div>
            </div>
            {contextMenu.visible && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenuItems()} onClose={closeContextMenu} />}
            {modal.visible && <ItemModal modalState={modal} onClose={() => setModal({ ...modal, visible: false })} onSave={handleSaveItem} users={USERS} pillars={PILLARS} />}
        </div>
    );
};

export default App;