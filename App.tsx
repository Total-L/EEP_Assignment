import React, { useState, useCallback, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    const [isDarkMode, setIsDarkMode] = useState(true);
    
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
    
    const handleExport = async () => {
        try {
            // Check current theme and use it for export
            const isDarkMode = document.documentElement.classList.contains('dark');
            const bgColor = isDarkMode ? '#0f1522' : '#ffffff';
            const textColor = isDarkMode ? '#f3f4f6' : '#1f2937';
            const borderColor = isDarkMode ? '#374151' : '#e5e7eb';

            // Create export container that covers everything
            const exportContainer = document.createElement('div');
            exportContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background: ${bgColor};
                z-index: 9999;
                padding: 20px;
                font-family: 'Inter', sans-serif;
            `;

            // Create export header
            const exportHeader = document.createElement('div');
            exportHeader.style.cssText = `
                text-align: center;
                margin-bottom: 20px;
                padding: 20px;
                border-bottom: 2px solid ${borderColor};
            `;
            exportHeader.innerHTML = `
                <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px; color: ${textColor};">Project Roadmap</h1>
                <p style="font-size: 16px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 4px;">HSBC</p>
                <p style="font-size: 12px; color: ${isDarkMode ? '#6b7280' : '#9ca3af'};">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            `;
            exportContainer.appendChild(exportHeader);

            // Clone the entire roadmap content directly from DOM
            const mainContent = document.querySelector('main');
            if (mainContent) {
                const contentClone = mainContent.cloneNode(true) as HTMLElement;
                contentClone.style.cssText = `
                    background: ${bgColor};
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0;
                `;
                
                // Remove all interactive elements but keep all content
                const elementsToRemove = contentClone.querySelectorAll('button, .print-hidden');
                elementsToRemove.forEach(el => el.remove());
                
                // Remove event handlers but keep elements
                const allElements = contentClone.querySelectorAll('*');
                allElements.forEach(el => {
                    el.removeAttribute('draggable');
                    el.removeAttribute('oncontextmenu');
                    el.removeAttribute('ondragstart');
                    el.removeAttribute('ondrop');
                    el.removeAttribute('ondragover');
                    el.removeAttribute('onclick');
                });
                
                // Ensure all elements are visible and properly styled
                const allVisible = contentClone.querySelectorAll('*');
                allVisible.forEach(el => {
                    const element = el as HTMLElement;
                    if (element.style) {
                        element.style.display = '';
                        element.style.visibility = '';
                        element.style.opacity = '';
                        element.style.overflow = '';
                        element.style.height = '';
                        element.style.minHeight = '';
                    }
                });
                
                exportContainer.appendChild(contentClone);
            }

            // Add status legend
            const legendContainer = document.createElement('div');
            legendContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 24px;
                margin-top: 20px;
                padding: 15px;
                background: ${isDarkMode ? '#1f2937' : '#f9fafb'};
                border: 1px solid ${borderColor};
                border-radius: 8px;
                font-size: 12px;
            `;
            legendContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #059669;"></div>
                    <span style="color: ${textColor};">In Progress</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #6b7280;"></div>
                    <span style="color: ${textColor};">Todo</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: #2563eb;"></div>
                    <span style="color: ${textColor};">Delayed</span>
                </div>
            `;
            exportContainer.appendChild(legendContainer);

            // Add export container to body
            document.body.appendChild(exportContainer);

            // Wait for rendering to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Generate PDF from the actual rendered content
            const canvas = await html2canvas(exportContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: exportContainer.scrollWidth,
                height: exportContainer.scrollHeight,
                backgroundColor: bgColor,
                allowTaint: true,
                foreignObjectRendering: true
            });

            // Remove export container immediately
            document.body.removeChild(exportContainer);

            // Create PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 277; // A4 landscape width with margins
            const pageHeight = 190; // A4 landscape height with margins
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft > 0) {
                position = -(imgHeight - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Download PDF
            pdf.save(`Project_Roadmap_HSBC_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
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
        <div>
            <Header users={USERS} viewMode={viewMode} setViewMode={setViewMode} onExport={handleExport} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
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