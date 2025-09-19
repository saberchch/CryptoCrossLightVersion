export type UserRole = 'learner' | 'educator' | 'moderator' | 'admin';

export interface SidebarItem {
  id: string;          // unique identifier
  label: string;       // display name
  icon: string;        // SVG path or icon name
}

export interface RoleConfig {
  sidebar: SidebarItem[];
  dashboard: UserRole;
}

// Full configuration for each role
export const roleConfig: Record<UserRole, RoleConfig> = {
  learner: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'quizzes', label: 'Quizzes', icon: 'M20 20...' },
      { id: 'certificates', label: 'Certificates', icon: 'M15 15...' },
      { id: 'history', label: 'Activity History', icon: 'M12 12...' },
    ],
    dashboard: 'learner',
  },
  educator: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'creator', label: 'Create Quiz / Exam', icon: 'M30 30...' },
      { id: 'quizzes', label: 'My Quizzes', icon: 'M20 20...' },
      { id: 'analytics', label: 'Analytics', icon: 'M40 40...' },
      { id: 'students', label: 'Students', icon: 'M25 25...' },
    ],
    dashboard: 'educator',
  },
  moderator: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'people', label: 'Manage Students', icon: 'M25 25...' }, // only their institution's students
      { id: 'quizzes', label: 'Institution Quizzes', icon: 'M20 20...' }, // quizzes created in their school
      { id: 'reports', label: 'Reports', icon: 'M35 35...' }, // progress and performance reports
      { id: 'certificate-approval', label: 'Approve Certificates', icon: 'M30 30...' }, // optional
    ],
    dashboard: 'moderator',
  },  
  admin: {
    sidebar: [
      { id: 'dashboard', label: 'Dashboard', icon: 'M10 20...' },
      { id: 'people', label: 'Manage All Users', icon: 'M25 25...' },
      { id: 'analytics', label: 'Platform Analytics', icon: 'M40 40...' },
      { id: 'settings', label: 'Settings', icon: 'M50 50...' },
    ],
    dashboard: 'admin',
  },
};

// Bottom static items common to all roles
export const bottomItems: SidebarItem[] = [
  { id: 'wallet', label: 'Wallet', icon: 'M50 50...' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'M60 60...' },
];
