
import React from 'react';

interface ContextMenuItem {
    label: string;
    action: () => void;
    isDestructive?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: ContextMenuItem[];
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    return (
        <div
            style={{ top: y, left: x }}
            className="fixed z-50 bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-md shadow-2xl py-1"
            onClick={(e) => e.stopPropagation()}
        >
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={() => {
                                item.action();
                                onClose();
                            }}
                            className={`w-full text-left px-4 py-1.5 text-sm ${item.isDestructive ? 'text-red-400' : 'text-slate-200'} hover:bg-slate-700 transition-colors`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContextMenu;
