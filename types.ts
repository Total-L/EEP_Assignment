
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
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
  date: string; // Absolute date string like '2024-07-07' to handle dynamic view modes
  dateIndex: number; // Derived based on view mode
  columnIndex: number;
  progress: number;
  status: Status;
  assignees: User[];
  tag?: string;
  description?: string;
  projectId?: string;
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