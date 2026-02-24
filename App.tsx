import React, { useState, useCallback, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Header from './components/Header';
import RoadmapGrid from './components/RoadmapGrid';
import ContextMenu from './components/ContextMenu';
import ItemModal from './components/ItemModal';
import { RoadmapItem, ContextMenuState, ModalState, Project, Status } from './types';
import { PILLARS, DATES_WEEK, DATES_MONTH, DATES_QUARTER, INITIAL_ITEMS, USERS, PROJECTS } from './constants';

const App: React.FC = () => {
    const [items, setItems] = useState<RoadmapItem[]>(INITIAL_ITEMS);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, type: 'cell', data: {} });
    const [modal, setModal] = useState<ModalState>({ visible: false, type: 'add', data: {} });
    const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('week');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);
    
    // Auto-update expired items to Delayed status on component mount
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.status === Status.Done) return item;
                
                const endDate = new Date(item.endDate);
                endDate.setHours(0, 0, 0, 0);
                
                if (endDate < today) {
                    return { ...item, status: Status.Delayed };
                }
                
                return item;
            })
        );
    }, []); // Run once on mount
    
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

    const dateIndexToAbsoluteDate = useCallback((idx: number, mode: string): string => {
        if (mode === 'week') {
            // Base date: 2026-02-16 (Monday) is week 0
            // idx can be a float: 0.0 = Monday, 1.0 = following Monday, etc.
            const baseDate = new Date('2026-02-16');
            const daysToAdd = idx * 7;
            baseDate.setDate(baseDate.getDate() + Math.floor(daysToAdd));
            return baseDate.toISOString().split('T')[0];
        } else if (mode === 'month') {
            // 12-month cycle starting from Feb 2026
            const baseMonth = 1; // Feb = month 1 (0-indexed)
            const baseYear = 2026;
            let month = (baseMonth + Math.floor(idx)) % 12;
            let year = baseYear + Math.floor((baseMonth + Math.floor(idx)) / 12);
            return `${year}-${String(month + 1).padStart(2, '0')}-01`;
        } else {
            // 8-quarter cycle starting from Q1 26 (Jan-Mar)
            const totalQuarters = Math.floor(idx);
            const baseYear = 2026;
            const year = baseYear + Math.floor(totalQuarters / 4);
            const quarterInYear = totalQuarters % 4;
            const month = quarterInYear * 3 + 1; // Q0=Jan(1), Q1=Apr(4), Q2=Jul(7), Q3=Oct(10)
            return `${year}-${String(month).padStart(2, '0')}-01`;
        }
    }, []);

    const handleDrop = (e: React.DragEvent, dateIndex: number, columnIndex: number) => {
        const itemId = e.dataTransfer.getData("itemId");

        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id !== itemId) return item;
                const oldStart = new Date(item.startDate).getTime();
                const oldEnd = new Date(item.endDate).getTime();
                const durationMs = oldEnd - oldStart;
                const newStartDate = dateIndexToAbsoluteDate(dateIndex, viewMode);
                const newEndDate = new Date(new Date(newStartDate).getTime() + durationMs).toISOString().split('T')[0];
                return { ...item, dateIndex, columnIndex, date: newStartDate, startDate: newStartDate, endDate: newEndDate };
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

    const getDateIndexForViewMode = useCallback((itemDate: string, viewMode: string): number => {
        const date = new Date(itemDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const day = date.getDate();
        
        switch (viewMode) {
            case 'month': {
                // Each month is a grid cell
                // 12-month cycle starting from Feb 2026
                const baseMonth = 1; // Feb = index 1 in JS (0=Jan)
                const baseYear = 2026;
                const monthsFromBase = (year - baseYear) * 12 + (month - baseMonth);
                return (monthsFromBase % 12 + 12) % 12; // Wrap around 12 months
            }
            case 'quarter': {
                // Each quarter is a grid cell
                // 8-quarter cycle starting from Q1 26
                const quarter = Math.floor(month / 3);
                // Q1 26 = quarter 0 (months 0-2), but we start from Q1 (months 0-2)
                // Actually, the quarter labels start from Q1 26 which includes Jan-Mar
                // But 2026 Q1 is Jan-Mar, so quarter 0 = months 0-2
                // month = 0 (Jan), 1 (Feb), 2 (Mar) → quarter 0
                // month = 3 (Apr), 4 (May), 5 (Jun) → quarter 1
                // etc.
                const quartersFromBase = (year - 2026) * 4 + quarter;
                return (quartersFromBase % 8 + 8) % 8; // Wrap around 8 quarters
            }
            case 'week':
            default: {
                // Support day-level precision: dateIndex can be float
                // Base: 2026-02-16 is week 0 (should match DATES_WEEK)
                const baseDate = new Date('2026-02-16');
                const diffMs = date.getTime() - baseDate.getTime();
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const weekIndex = diffDays / 7;
                return Math.max(weekIndex, 0);
            }
        }
    }, []);

    // Compute active items based on selected view mode and project
    const activeItems = useMemo(() => {
        return items
            .filter((item: RoadmapItem) => item.projectId === selectedProject.id)
            .map((item: RoadmapItem) => {
                const newDateIndex = getDateIndexForViewMode(item.startDate, viewMode);
                const newEndDateIndex = getDateIndexForViewMode(item.endDate, viewMode);
                return { ...item, dateIndex: newDateIndex, endDateIndex: newEndDateIndex };
            });
    }, [items, selectedProject, viewMode, getDatesForViewMode, getDateIndexForViewMode]);
    
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

    const getEffectiveStatus = (item: RoadmapItem): Status => {
        // Auto-detect delayed status: if end date has passed and status is not Done, mark as Delayed
        if (item.status === Status.Done) return Status.Done;
        
        const endDate = new Date(item.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        
        if (endDate < today) {
            return Status.Delayed;
        }
        
        return item.status;
    };

    const contextMenuItems = () => {
        if (contextMenu.type === 'cell') {
            return [{ label: 'Add New Item', action: () => handleAddItem(contextMenu.data as any) }];
        }
        if (contextMenu.type === 'item') {
            const item = (contextMenu.data as {item: RoadmapItem}).item;
            const effectiveStatus = getEffectiveStatus(item);
            
            // Cycle through statuses: Todo → InProgress → Done → Delayed → Todo
            const statusCycle = [Status.Todo, Status.InProgress, Status.Done, Status.Delayed];
            const currentStatusIndex = statusCycle.indexOf(effectiveStatus);
            const nextStatus = statusCycle[(currentStatusIndex + 1) % statusCycle.length];
            
            return [
                { label: 'Edit Item', action: () => handleEditItem(item) },
                { label: `Change Status to ${nextStatus}`, action: () => {
                    setItems(prev => prev.map(i => 
                        i.id === item.id ? { ...i, status: nextStatus } : i
                    ));
                }},
                { label: 'Increase Progress 25%', action: () => {
                    setItems(prev => prev.map(i => 
                        i.id === item.id ? { ...i, progress: Math.min(i.progress + 25, 100) } : i
                    ));
                }},
                { label: 'Duplicate Item', action: () => {
                    const duplicatedItem: RoadmapItem = {
                        ...item,
                        id: `item-${Date.now()}`,
                        startDate: item.startDate,
                        endDate: item.endDate,
                    };
                    setItems(prev => [...prev, duplicatedItem]);
                }},
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
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Todo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Done</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Delayed</span>
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
