
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export enum Status {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Done = 'Done',
  Delayed = 'Delayed',
}

export interface RoadmapItem {
  id: string;
  title: string;
  pillarId: number;
  dateIndex: number;
  columnIndex: number;
  progress: number;
  status: Status;
  assignees: User[];
  tag?: string;
  description?: string;
}

export interface Pillar {
  id: number;
  title: string;
  description: string;
  color: 'salmon' | 'gold' | 'emerald' | 'azure';
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  type: 'cell' | 'item';
  data: { dateIndex?: number, columnIndex?: number } | { item?: RoadmapItem } | {};
}

export type ModalState = {
  visible: boolean;
  type: 'add' | 'edit';
  data: { dateIndex?: number, columnIndex?: number, pillarId?: number } | { item?: RoadmapItem } | {};
}
