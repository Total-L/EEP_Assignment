
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
  date: string; // Absolute date string like '2024-07-07' — alias for startDate
  startDate: string; // Start date of the item
  endDate: string;   // End date of the item (same as startDate for single-row)
  dateIndex: number; // Derived from startDate based on view mode
  endDateIndex: number; // Derived from endDate based on view mode
  columnIndex: number;
  progress: number;
  status: Status;
  assignees: User[];
  tag?: string;
  description?: string;
  projectId?: string;
}

export interface PositionedItem extends RoadmapItem {
  top: number;
  height: number;
  left: number;
  width: number;
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