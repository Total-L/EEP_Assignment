
import React, { useState, useEffect } from 'react';
import { RoadmapItem, ModalState, User, Pillar, Status } from '../types';

interface ItemModalProps {
    modalState: ModalState;
    onClose: () => void;
    onSave: (itemData: Omit<RoadmapItem, 'id'>, id?: string) => void;
    users: User[];
    pillars: Pillar[];
}

const ItemModal: React.FC<ItemModalProps> = ({ modalState, onClose, onSave, users, pillars }) => {
    const isEdit = modalState.type === 'edit';
    const initialData = isEdit ? (modalState.data as { item: RoadmapItem }).item : (modalState.data as any);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pillarId, setPillarId] = useState<number>(1);
    const [status, setStatus] = useState<Status>(Status.Todo);
    const [progress, setProgress] = useState(0);
    const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    useEffect(() => {
        if (isEdit && initialData) {
            setTitle(initialData.title || '');
            setDescription(initialData.description || '');
            setPillarId(initialData.pillarId || 1);
            setStatus(initialData.status || Status.Todo);
            setProgress(initialData.progress || 0);
            setAssigneeIds(initialData.assignees?.map((u: User) => u.id) || []);
            setStartDate(initialData.startDate || initialData.date || '');
            setEndDate(initialData.endDate || initialData.date || '');
        } else if (!isEdit && initialData) {
            setPillarId(initialData.pillarId || 1);
            setTitle('');
            setDescription('');
            setStatus(Status.Todo);
            setProgress(0);
            setAssigneeIds([]);
            const derivedDate = initialData.date || new Date().toISOString().split('T')[0];
            setStartDate(derivedDate);
            setEndDate(derivedDate);
        }
    }, [modalState, isEdit, initialData]);

    // Fixed: Explicitly typed itemData and included the missing 'date' property to satisfy the RoadmapItem interface
    const handleSave = () => {
        const validEndDate = endDate >= startDate ? endDate : startDate;
        const itemData: Omit<RoadmapItem, 'id'> = {
            title,
            description,
            pillarId,
            status,
            progress,
            assignees: users.filter(u => assigneeIds.includes(u.id)),
            date: startDate,
            startDate,
            endDate: validEndDate,
            dateIndex: isEdit ? initialData.dateIndex : initialData.dateIndex,
            endDateIndex: isEdit ? initialData.endDateIndex : initialData.dateIndex,
            columnIndex: isEdit ? initialData.columnIndex : pillars.findIndex(p => p.id === pillarId),
            projectId: isEdit ? initialData.projectId : initialData.projectId,
            tag: isEdit ? initialData.tag : undefined
        };
        onSave(itemData, isEdit ? initialData.id : undefined);
    };
    
    const handleAssigneeChange = (userId: string) => {
        setAssigneeIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    };

    if (!modalState.visible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{isEdit ? 'Edit Item' : 'Add New Item'}</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Description (Optional)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary h-20"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Pillar</label>
                        <select value={pillarId} onChange={e => setPillarId(Number(e.target.value))} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                            {pillars.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Start Date</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">End Date</label>
                            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as Status)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-2 mt-1 text-slate-900 dark:text-white focus:ring-primary focus:border-primary">
                            {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress: {progress}%</label>
                        <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full mt-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Assignees</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {users.map(user => (
                               <button key={user.id} onClick={() => handleAssigneeChange(user.id)} className={`flex items-center gap-2 p-1 rounded-full border-2 transition-all ${assigneeIds.includes(user.id) ? 'border-primary' : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                   <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover"/>
                               </button>
                           ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/20">Save</button>
                </div>
            </div>
        </div>
    );
};

export default ItemModal;
