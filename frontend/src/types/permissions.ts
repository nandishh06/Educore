// Permission definitions for role-based access control

export type UserRole = 'admin' | 'principal' | 'hod' | 'teacher'

export type Permission = string

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  navigationItems: string[]
}

// Define all available permissions
export const PERMISSIONS = {
  // Dashboard permissions
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_DASHBOARD_STATS: 'view_dashboard_stats',
  
  // Student permissions
  VIEW_STUDENTS: 'view_students',
  ADD_STUDENT: 'add_student',
  EDIT_STUDENT: 'edit_student',
  DELETE_STUDENT: 'delete_student',
  VIEW_STUDENT_DETAILS: 'view_student_details',
  
  // Teacher permissions
  VIEW_TEACHERS: 'view_teachers',
  ADD_TEACHER: 'add_teacher',
  EDIT_TEACHER: 'edit_teacher',
  DELETE_TEACHER: 'delete_teacher',
  VIEW_TEACHER_DETAILS: 'view_teacher_details',
  
  // Department permissions
  VIEW_DEPARTMENTS: 'view_departments',
  ADD_DEPARTMENT: 'add_department',
  EDIT_DEPARTMENT: 'edit_department',
  DELETE_DEPARTMENT: 'delete_department',
  MANAGE_DEPARTMENT: 'manage_department',
  
  // Attendance permissions
  VIEW_ATTENDANCE: 'view_attendance',
  MARK_ATTENDANCE: 'mark_attendance',
  EDIT_ATTENDANCE: 'edit_attendance',
  DELETE_ATTENDANCE: 'delete_attendance',
  VIEW_ATTENDANCE_REPORTS: 'view_attendance_reports',
  
  // Settings permissions
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  SYSTEM_ADMIN: 'system_admin',
  
  // General permissions
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
  MANAGE_USERS: 'manage_users'
} as const

// Define role-based permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      // Admin has all permissions
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_DASHBOARD_STATS,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.ADD_STUDENT,
      PERMISSIONS.EDIT_STUDENT,
      PERMISSIONS.DELETE_STUDENT,
      PERMISSIONS.VIEW_STUDENT_DETAILS,
      PERMISSIONS.VIEW_TEACHERS,
      PERMISSIONS.ADD_TEACHER,
      PERMISSIONS.EDIT_TEACHER,
      PERMISSIONS.DELETE_TEACHER,
      PERMISSIONS.VIEW_TEACHER_DETAILS,
      PERMISSIONS.VIEW_DEPARTMENTS,
      PERMISSIONS.ADD_DEPARTMENT,
      PERMISSIONS.EDIT_DEPARTMENT,
      PERMISSIONS.DELETE_DEPARTMENT,
      PERMISSIONS.MANAGE_DEPARTMENT,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.EDIT_ATTENDANCE,
      PERMISSIONS.DELETE_ATTENDANCE,
      PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
      PERMISSIONS.VIEW_SETTINGS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.SYSTEM_ADMIN,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_DATA,
      PERMISSIONS.MANAGE_USERS
    ],
    navigationItems: ['dashboard', 'students', 'teachers', 'departments', 'attendance', 'settings']
  },
  {
    role: 'principal',
    permissions: [
      // Principal can view and manage most things, but not system admin
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_DASHBOARD_STATS,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.ADD_STUDENT,
      PERMISSIONS.EDIT_STUDENT,
      PERMISSIONS.DELETE_STUDENT,
      PERMISSIONS.VIEW_STUDENT_DETAILS,
      PERMISSIONS.VIEW_TEACHERS,
      PERMISSIONS.ADD_TEACHER,
      PERMISSIONS.EDIT_TEACHER,
      PERMISSIONS.DELETE_TEACHER,
      PERMISSIONS.VIEW_TEACHER_DETAILS,
      PERMISSIONS.VIEW_DEPARTMENTS,
      PERMISSIONS.ADD_DEPARTMENT,
      PERMISSIONS.EDIT_DEPARTMENT,
      PERMISSIONS.MANAGE_DEPARTMENT,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
      PERMISSIONS.VIEW_SETTINGS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.EXPORT_DATA
    ],
    navigationItems: ['dashboard', 'students', 'teachers', 'departments', 'attendance', 'settings']
  },
  {
    role: 'hod',
    permissions: [
      // HOD can manage their department and related data
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_DASHBOARD_STATS,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.ADD_STUDENT,
      PERMISSIONS.EDIT_STUDENT,
      PERMISSIONS.VIEW_STUDENT_DETAILS,
      PERMISSIONS.VIEW_TEACHERS,
      PERMISSIONS.ADD_TEACHER,
      PERMISSIONS.EDIT_TEACHER,
      PERMISSIONS.VIEW_TEACHER_DETAILS,
      PERMISSIONS.VIEW_DEPARTMENTS,
      PERMISSIONS.EDIT_DEPARTMENT,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
      PERMISSIONS.VIEW_REPORTS
    ],
    navigationItems: ['dashboard', 'students', 'teachers', 'departments', 'attendance']
  },
  {
    role: 'teacher',
    permissions: [
      // Teacher can view students and mark attendance for their classes
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_STUDENTS,
      PERMISSIONS.VIEW_STUDENT_DETAILS,
      PERMISSIONS.VIEW_ATTENDANCE,
      PERMISSIONS.MARK_ATTENDANCE,
      PERMISSIONS.VIEW_ATTENDANCE_REPORTS
    ],
    navigationItems: ['dashboard', 'students', 'attendance']
  }
]

// Helper functions to check permissions
export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === userRole)
  return roleConfig?.permissions.includes(permission) || false
}

export const canAccessNavigation = (userRole: UserRole, navigationItem: string): boolean => {
  const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === userRole)
  return roleConfig?.navigationItems.includes(navigationItem) || false
}

export const getPermissionsForRole = (userRole: UserRole): Permission[] => {
  const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === userRole)
  return roleConfig?.permissions || []
}

export const getNavigationForRole = (userRole: UserRole): string[] => {
  const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === userRole)
  return roleConfig?.navigationItems || []
}
