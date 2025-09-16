export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface RoleConfig {
  sidebar: SidebarItem[];
  dashboard: 'learner' | 'educator' | 'moderator' | 'admin';
}

export const roleConfig: Record<string, RoleConfig> = {
  learner: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'quizzes', label: 'Quizzes', icon: 'M20 20...' },
      { id: 'certificates', label: 'Certificates', icon: 'M15 15...' },
    ],
    dashboard: 'learner',
  },
  educator: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'creator', label: 'Creator Tools', icon: 'M30 30...' },
      { id: 'quizzes', label: 'Quizzes', icon: 'M20 20...' },
      { id: 'analytics', label: 'Analytics', icon: 'M40 40...' },
    ],
    dashboard: 'educator',
  },
  moderator: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'people', label: 'People', icon: 'M25 25...' },
      { id: 'quizzes', label: 'Quizzes', icon: 'M20 20...' },
    ],
    dashboard: 'moderator',
  },
  admin: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'people', label: 'People', icon: 'M25 25...' },
      { id: 'analytics', label: 'Analytics', icon: 'M40 40...' },
    ],
    dashboard: 'admin',
  },
};

export const bottomItems: SidebarItem[] = [
  { id: 'wallet', label: 'Wallet', icon: 'M50 50...' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'M60 60...' },
];
