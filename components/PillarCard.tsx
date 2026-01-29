
import React from 'react';
import { Pillar } from '../types';

interface PillarCardProps {
    pillar: Pillar;
}

const colorClasses = {
    salmon: {
        bg: 'bg-pillar-salmon/5',
        border: 'border-pillar-salmon/20',
        text: 'text-pillar-salmon',
        glow: 'shadow-[0_0_15px_-3px_rgba(248,113,113,0.1)]'
    },
    gold: {
        bg: 'bg-pillar-gold/5',
        border: 'border-pillar-gold/20',
        text: 'text-pillar-gold',
        glow: 'shadow-[0_0_15px_-3px_rgba(251,191,36,0.1)]'
    },
    emerald: {
        bg: 'bg-pillar-emerald/5',
        border: 'border-pillar-emerald/20',
        text: 'text-pillar-emerald',
        glow: 'shadow-[0_0_15px_-3px_rgba(52,211,153,0.1)]'
    },
    azure: {
        bg: 'bg-pillar-azure/5',
        border: 'border-pillar-azure/20',
        text: 'text-pillar-azure',
        glow: 'shadow-[0_0_15px_-3px_rgba(96,165,250,0.1)]'
    },
};

const PillarCard: React.FC<PillarCardProps> = ({ pillar }) => {
    const classes = colorClasses[pillar.color];

    return (
        <div className={`px-6 py-5 rounded-2xl flex flex-col justify-between min-h-[140px] ${classes.bg} ${classes.border} ${classes.glow}`}>
            <span className={`text-[10px] font-bold ${classes.text} uppercase tracking-widest mb-2`}>{pillar.title}</span>
            <p className="font-bold text-slate-900 dark:text-white leading-tight text-lg">{pillar.description}</p>
        </div>
    );
};

export default PillarCard;
