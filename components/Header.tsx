
import React, { useState } from 'react';
import { User, Project } from '../types';
import { PROJECTS } from '../constants';

interface HeaderProps {
    users: User[];
    viewMode: 'week' | 'month' | 'quarter';
    setViewMode: (mode: 'week' | 'month' | 'quarter') => void;
    onExport: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void;
    selectedProject: Project;
    onProjectChange: (project: Project) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    users, 
    viewMode, 
    setViewMode, 
    onExport, 
    isDarkMode, 
    setIsDarkMode,
    selectedProject,
    onProjectChange
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="border-b border-slate-200 dark:border-slate-800/50 p-4 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3 relative">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 print-hidden">
                        <span className="material-icons">rocket_launch</span>
                    </div>
                    <div 
                        className="cursor-pointer group flex flex-col"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex items-center gap-1">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                {selectedProject.name}
                            </h1>
                            <span className="material-icons text-slate-400 dark:text-slate-500 text-lg">arrow_drop_down</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{selectedProject.client}</p>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-10 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[60] py-2 overflow-hidden">
                            {PROJECTS.map((project) => (
                                <button
                                    key={project.id}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 ${
                                        selectedProject.id === project.id ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                    onClick={() => {
                                        onProjectChange(project);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {project.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-6 print-hidden">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors"
                        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? (
                            <span className="material-icons text-yellow-500">light_mode</span>
                        ) : (
                            <span className="material-icons text-slate-700">dark_mode</span>
                        )}
                    </button>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800/40 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                        <button onClick={() => setViewMode('week')} className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${viewMode === 'week' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Week</button>
                        <button onClick={() => setViewMode('month')} className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${viewMode === 'month' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Month</button>
                        <button onClick={() => setViewMode('quarter')} className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${viewMode === 'quarter' ? 'bg-slate-700 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>Quarter</button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {users.slice(0, 2).map(user => (
                                <img key={user.id} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark object-cover" src={user.avatarUrl} />
                            ))}
                            {users.length > 2 && <div className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">+{users.length - 2}</div>}
                        </div>
                        <button onClick={onExport} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all shadow-lg shadow-primary/20">
                            Export Report
                        </button>
                    </div>
                </div>
            </div>
            {isDropdownOpen && <div className="fixed inset-0 z-50" onClick={() => setIsDropdownOpen(false)}></div>}
        </header>
    );
};

export default Header;