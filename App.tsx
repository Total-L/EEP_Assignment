
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Header from './components/Header';
import RoadmapGrid from './components/RoadmapGrid';
import ContextMenu from './components/ContextMenu';
import ItemModal from './components/ItemModal';
import { RoadmapItem, ContextMenuState, ModalState, Project } from './types';
import { PILLARS, DATES_WEEK, DATES_MONTH, DATES_QUARTER, INITIAL_ITEMS, USERS, PROJECTS } from './constants';

const App: React.FC = () => {
    const [items, setItems] = useState<RoadmapItem[]>(INITIAL_ITEMS);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, type: 'cell', data: {} });
    const [modal, setModal] = useState<ModalState>({ visible: false, type: 'add', data: {} });
    const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('week');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
    
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

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

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
        const dates = getDatesForViewMode();
        const newDateLabel = dates[dateIndex];
        
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId) {
                    // Update the absolute date string based on the new slot
                    // This is a simplified logic to persist date-based positioning
                    return { ...item, dateIndex, columnIndex };
                }
                return item;
            })
        );
    };

    // Fixed: Pass current project ID when opening the modal for a new item
    const handleAddItem = (data: { dateIndex: number, columnIndex: number }) => {
      const pillarId = PILLARS[data.columnIndex].id;
      setModal({ visible: true, type: 'add', data: { dateIndex: data.dateIndex, columnIndex: data.columnIndex, pillarId, projectId: selectedProject.id } });
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
            setItems(prev => prev.map(item => item.id === id ? { ...itemData, id } : item));
        } else {
            const newItem: RoadmapItem = {
                ...itemData,
                id: `item-${Date.now()}`,
            };
            setItems(prev => [...prev, newItem]);
        }
        setModal({ visible: false, type: 'add', data: {} });
    };

    const getDatesForViewMode = useCallback(() => {
        switch (viewMode) {
            case 'month': return DATES_MONTH;
            case 'quarter': return DATES_QUARTER;
            case 'week':
            default: return DATES_WEEK;
        }
    }, [viewMode]);

    // Compute active items based on selected view mode and project
    const activeItems = useMemo(() => {
        const currentDates = getDatesForViewMode();
        return items
            .filter(item => item.projectId === selectedProject.id)
            .map(item => {
                // Map the item's position based on viewMode labels
                // In a production app, we'd use real Date objects and find the correct index
                // Here we just use the logic that they shift relative to their initial slot
                return { ...item }; 
            });
    }, [items, selectedProject, viewMode, getDatesForViewMode]);
    
    const handleExport = async () => {
        try {
            const isDarkMode = document.documentElement.classList.contains('dark');
            const bgColor = isDarkMode ? '#0f1522' : '#ffffff';
            const textColor = isDarkMode ? '#f3f4f6' : '#1f2937';
            const borderColor = isDarkMode ? '#374151' : '#e5e7eb';

            const exportContainer = document.createElement('div');
            exportContainer.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; background: ${bgColor}; z-index: 9999; padding: 20px; font-family: 'Inter', sans-serif;
            `;

            const exportHeader = document.createElement('div');
            exportHeader.style.cssText = `
                text-align: center; margin-bottom: 20px; padding: 20px; border-bottom: 2px solid ${borderColor};
            `;
            exportHeader.innerHTML = `
                <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: ${textColor};">${selectedProject.name}</h1>
                <p style="font-size: 16px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 4px;">${selectedProject.client}</p>
                <p style="font-size: 12px; color: ${isDarkMode ? '#6b7280' : '#9ca3af'};">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            `;
            exportContainer.appendChild(exportHeader);

            const mainContent = document.querySelector('main');
            if (mainContent) {
                const contentClone = mainContent.cloneNode(true) as HTMLElement;
                contentClone.style.cssText = `background: ${bgColor}; max-width: 1200px; margin: 0 auto; padding: 0;`;
                const elementsToRemove = contentClone.querySelectorAll('button, .print-hidden');
                elementsToRemove.forEach(el => el.remove());
                exportContainer.appendChild(contentClone);
            }

            document.body.appendChild(exportContainer);
            await new Promise(resolve => setTimeout(resolve, 500));
            const canvas = await html2canvas(exportContainer, {
                scale: 2, useCORS: true, logging: false, width: exportContainer.scrollWidth, height: exportContainer.scrollHeight, backgroundColor: bgColor,
            });
            document.body.removeChild(exportContainer);

            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            pdf.addImage(imgData, 'PNG', 10, 10, 277, (canvas.height * 277) / canvas.width);
            pdf.save(`${selectedProject.name}_Roadmap_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF.');
        }
    };

    const contextMenuItems = () => {
        if (contextMenu.type === 'cell') {
            return [{ label: 'Add New Item', action: () => handleAddItem(contextMenu.data as any) }];
        }
        if (contextMenu.type === 'item') {
            const item = (contextMenu.data as {item: RoadmapItem}).item;
            return [
                { label: 'Edit Item', action: () => handleEditItem(item) },
                { label: 'Delete Item', action: () => handleDeleteItem(item), isDestructive: true },
            ];
        }
        return [];
    };

    const currentDates = getDatesForViewMode();

    return (
        <div>
            <Header 
                users={USERS} 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                onExport={handleExport} 
                isDarkMode={isDarkMode} 
                setIsDarkMode={setIsDarkMode} 
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
            />
            <main className="max-w-[1600px] mx-auto p-6">
                <RoadmapGrid
                    pillars={PILLARS}
                    dates={currentDates}
                    items={activeItems}
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                />
            </main>
            <div className="fixed bottom-6 right-6 flex items-center gap-6 print-hidden">
                <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl shadow-2xl z-50 flex flex-col gap-2 border border-slate-200/50 dark:border-white/5 min-w-[220px]">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest px-1">Roadmap Status</span>
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-pillar-emerald"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Todo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Delayed</span>
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
