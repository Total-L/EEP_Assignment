
import { Pillar, RoadmapItem, User, Status, Project } from './types';

export const USERS: User[] = [
    { id: 'user1', name: 'Alex', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYuwVj2RTk8UNjm3hosPJWHPnNh224F29tPGBfb3DzM4CkZWy1kelE2T3xI-wlSVYFMUBgjPgxQgc2nLDM6dY48Gz37kM583XRbHvj295sz9QpxHbn_AsG8pL3htQz-yY-cU5TaERxA0dfViR3YMqrIqQiukPOi07AaGkpX5KBG1XzyGNig5KRUc0jahNYK853feOT01D9L4gZnQ8eNQ4GWrz2AiX6QcYnyu0U-pxPxGUfuy3U2BvxtWceR7zsHaqqsQMCWTpdycw' },
    { id: 'user2', name: 'Sam', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCWX3sUQGJUCzFiE93yXzwq3ezqREoK3B-7zUgSanTIn3vnwjBf5prq3cMvHfMMdpqG06YQk5XmOlWKU8LxsC-RpIa0-0HkHM2h2y9GcS6fQDUXwSbSCVczoT6aZrc3sq_PytZKKpgaO57DieXe5FAfs1Ytz3U6cIbicSZDfqFve_s1igLpRZV3p4MoMu1cOil5LxfnWxmw2E0H3ljgztV7Bu6uLwjFznit_bVMx9CjndBy8fJ1EF856rYvvA3kZKBaUjxJ_-FqVA' },
    { id: 'user3', name: 'Dev 1', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV1jPwE5_px5iHg3Sc4URVc3wk-j_UNDaaVAl6jATxqGCRvEFPjHPEqk3CW4HiQ8n2MBVFdK3qt15HCsctifK3SFdBKuwS1xXamKv48XnUyuZPIXQ1j96o-OAxnAxkV62ROYllKvMl3pdb2sSaA2osdQIwbOKh6NGftP9axb-wqKD5VXTHHa6c85aizVL41DiF8yk73_z_z7qLJSotueMILUnF5QT_E_ImsbM3OmpHY0sQLQKpGEW0LX1oNdU6OcCd8Ey9qLxccXs' },
    { id: 'user4', name: 'Dev 2', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2xRpt3QXMObZ_cFTJqjTe1PsvJanF3reh_2lItdq8fpOe5AFkf0ZGQLcjgBzNlY70I9daL3qIgv-D3DsCsHWXbJ1IzKKvwaP409MTEqlgvehH_6ATaGSqm1MbD5FG4tYQt6d7soKOAO8v-k9McqEj84qOSQi8UINNo7yFGq626teVqSHZQfr21kfLVCjQcknXSwbC2-PQkUJ9IMaLxq8pOaI3lnwm56DWQWeGhAN1DmeOkFxFhF7w1gxaibh4q1HaBRFJeoGQA88' }
];

export const PROJECTS: Project[] = [
    { id: 'p1', name: 'Project Roadmap', client: 'HSBC' },
    { id: 'p2', name: 'Cloud Migration', client: 'HSBC' },
    { id: 'p3', name: 'Cyber Security', client: 'HSBC' }
];

export const PILLARS: Pillar[] = [
    { id: 1, title: 'Pillar 01', description: 'Migrate 5 names to Falcon LOMM to demonstrate ability to scale up', color: 'salmon' },
    { id: 2, title: 'Pillar 02', description: 'Template based pricing infrastructure using Firebird', color: 'gold' },
    { id: 3, title: 'Pillar 03', description: '10 underlyings with 2 connections to HKFE', color: 'emerald' },
    { id: 4, title: 'Pillar 04', description: 'Mandatory & discretionary updates', color: 'azure' },
];

export const DATES_WEEK: string[] = ['7 JUL', '14 JUL', '21 JUL', '28 JUL', '04 AUG', '11 AUG', '18 AUG', '25 AUG', '01 SEP', '08 SEP', '15 SEP', '22 SEP', '29 SEP', '06 OCT', '13 OCT', '20 OCT'];
export const DATES_MONTH: string[] = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
export const DATES_QUARTER: string[] = ['Q3 24', 'Q4 24', 'Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26'];

export const INITIAL_ITEMS: RoadmapItem[] = [
    // Project Roadmap (p1) - HSBC
    { id: 'item1', title: 'Review and address pricing difference vs Horizon', pillarId: 1, date: '2024-07-07', dateIndex: 0, columnIndex: 0, progress: 85, status: Status.InProgress, assignees: [USERS[2]], projectId: 'p1' },
    { id: 'item4', title: 'Pricing template generation', pillarId: 1, date: '2024-07-14', dateIndex: 1, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item3', title: 'Ladder2 pricing requests to Firebird', pillarId: 2, date: '2024-07-14', dateIndex: 1, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item2', title: 'Query and subscribe for update of liquidity level', pillarId: 1, date: '2024-07-21', dateIndex: 2, columnIndex: 0, progress: 100, status: Status.Done, assignees: [], projectId: 'p1' },
    { id: 'item7', title: 'Persist and publish the liquidity level mapping', pillarId: 1, date: '2024-07-21', dateIndex: 2, columnIndex: 0, progress: 25, status: Status.InProgress, assignees: [USERS[3]], projectId: 'p1' },
    { id: 'item8', title: 'Automate update of parameters', pillarId: 2, date: '2024-07-21', dateIndex: 2, columnIndex: 1, progress: 65, status: Status.InProgress, assignees: [], description: 'Integration from liquidity level', projectId: 'p1' },
    { id: 'item5', title: 'Simple AQ monitor', pillarId: 3, date: '2024-07-21', dateIndex: 2, columnIndex: 2, progress: 40, status: Status.InProgress, assignees: [], projectId: 'p1' },
    { id: 'item6', title: 'HKEX updates to minimum spread for cash equities', pillarId: 4, date: '2024-07-21', dateIndex: 2, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], tag: 'Mandatory', projectId: 'p1' },
    { id: 'item12', title: 'Ability to partition products by underlier', pillarId: 1, date: '2024-07-28', dateIndex: 3, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item9', title: 'Investigate Threading strategy', pillarId: 3, date: '2024-07-28', dateIndex: 3, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item10', title: 'Migrate single underlier to ladderV2', pillarId: 3, date: '2024-07-28', dateIndex: 3, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item11', title: 'Improve threading & connection handling', pillarId: 4, date: '2024-07-28', dateIndex: 3, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item13', title: 'Deploy additional MMEs pricing', pillarId: 1, date: '2024-08-04', dateIndex: 4, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item14', title: 'Complete migration to ladders v2', pillarId: 2, date: '2024-08-11', dateIndex: 5, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item15', title: 'Complete support for additional connections', pillarId: 3, date: '2024-08-11', dateIndex: 5, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item16', title: 'Performance testing and optimization', pillarId: 1, date: '2024-08-18', dateIndex: 6, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [USERS[0]], projectId: 'p1' },
    { id: 'item17', title: 'Documentation and training', pillarId: 4, date: '2024-08-25', dateIndex: 7, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item18', title: 'User acceptance testing', pillarId: 2, date: '2024-09-01', dateIndex: 8, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [USERS[1]], projectId: 'p1' },
    { id: 'item19', title: 'Production deployment', pillarId: 1, date: '2024-09-15', dateIndex: 10, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },
    { id: 'item20', title: 'Post-deployment support', pillarId: 4, date: '2024-09-22', dateIndex: 11, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p1' },

    // Cloud Migration (p2) - HSBC
    { id: 'cloud1', title: 'Infrastructure assessment', pillarId: 1, date: '2024-07-07', dateIndex: 0, columnIndex: 0, progress: 100, status: Status.Done, assignees: [USERS[0]], projectId: 'p2' },
    { id: 'cloud2', title: 'Define cloud architecture', pillarId: 2, date: '2024-07-14', dateIndex: 1, columnIndex: 1, progress: 75, status: Status.InProgress, assignees: [USERS[2]], projectId: 'p2' },
    { id: 'cloud3', title: 'Security compliance review', pillarId: 4, date: '2024-07-21', dateIndex: 2, columnIndex: 3, progress: 50, status: Status.InProgress, assignees: [], projectId: 'p2' },
    { id: 'cloud4', title: 'Data migration strategy', pillarId: 3, date: '2024-07-28', dateIndex: 3, columnIndex: 2, progress: 30, status: Status.InProgress, assignees: [USERS[3]], projectId: 'p2' },
    { id: 'cloud5', title: 'Proof of concept development', pillarId: 1, date: '2024-08-04', dateIndex: 4, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud6', title: 'Network configuration', pillarId: 2, date: '2024-08-11', dateIndex: 5, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud7', title: 'Load testing', pillarId: 3, date: '2024-08-18', dateIndex: 6, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [USERS[1]], projectId: 'p2' },
    { id: 'cloud8', title: 'Disaster recovery setup', pillarId: 4, date: '2024-08-25', dateIndex: 7, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud9', title: 'Pilot migration', pillarId: 1, date: '2024-09-01', dateIndex: 8, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud10', title: 'Full migration execution', pillarId: 2, date: '2024-09-15', dateIndex: 10, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud11', title: 'Performance monitoring', pillarId: 3, date: '2024-09-22', dateIndex: 11, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [], projectId: 'p2' },
    { id: 'cloud12', title: 'Cloud optimization', pillarId: 1, date: '2024-10-06', dateIndex: 13, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [USERS[0]], projectId: 'p2' },

    // Cyber Security (p3) - HSBC
    { id: 'cyber1', title: 'Security audit', pillarId: 4, date: '2024-07-07', dateIndex: 0, columnIndex: 3, progress: 100, status: Status.Done, assignees: [USERS[1]], projectId: 'p3' },
    { id: 'cyber2', title: 'Vulnerability assessment', pillarId: 1, date: '2024-07-14', dateIndex: 1, columnIndex: 0, progress: 90, status: Status.InProgress, assignees: [], projectId: 'p3' },
    { id: 'cyber3', title: 'Penetration testing', pillarId: 2, date: '2024-07-21', dateIndex: 2, columnIndex: 1, progress: 60, status: Status.InProgress, assignees: [USERS[2]], projectId: 'p3' },
    { id: 'cyber4', title: 'Security patching', pillarId: 4, date: '2024-07-28', dateIndex: 3, columnIndex: 3, progress: 45, status: Status.InProgress, assignees: [], projectId: 'p3' },
    { id: 'cyber5', title: 'Incident response plan', pillarId: 3, date: '2024-08-04', dateIndex: 4, columnIndex: 2, progress: 20, status: Status.InProgress, assignees: [USERS[3]], projectId: 'p3' },
    { id: 'cyber6', title: 'Firewall configuration', pillarId: 1, date: '2024-08-11', dateIndex: 5, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [], projectId: 'p3' },
    { id: 'cyber7', title: 'Encryption implementation', pillarId: 2, date: '2024-08-18', dateIndex: 6, columnIndex: 1, progress: 0, status: Status.Todo, assignees: [], projectId: 'p3' },
    { id: 'cyber8', title: 'Access control review', pillarId: 4, date: '2024-08-25', dateIndex: 7, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [USERS[0]], projectId: 'p3' },
    { id: 'cyber9', title: 'Threat monitoring setup', pillarId: 3, date: '2024-09-01', dateIndex: 8, columnIndex: 2, progress: 0, status: Status.Todo, assignees: [], projectId: 'p3' },
    { id: 'cyber10', title: 'Security training', pillarId: 4, date: '2024-09-08', dateIndex: 9, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p3' },
    { id: 'cyber11', title: 'Compliance certification', pillarId: 1, date: '2024-09-15', dateIndex: 10, columnIndex: 0, progress: 0, status: Status.Todo, assignees: [USERS[1]], projectId: 'p3' },
    { id: 'cyber12', title: 'Annual security review', pillarId: 4, date: '2024-10-20', dateIndex: 15, columnIndex: 3, progress: 0, status: Status.Todo, assignees: [], projectId: 'p3' },
];