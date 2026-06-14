export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  store_id?: string;
  is_superuser: boolean;
}

export interface Vacation {
  id: string;
  user_id: string;
  user?: User;
  vacation_type: VacationType;
  status: VacationStatus;
  start_date: string;
  end_date: string;
  total_days: number;
  work_days: number;
  comment?: string;
  approved_by_id?: string;
  approved_by?: User;
  approval_date?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface VacationCreate {
  user_id?: string;
  vacation_type: VacationType;
  start_date: string;
  end_date: string;
  total_days: number;
  work_days: number;
  comment?: string;
}

export interface VacationUpdate {
  vacation_type?: VacationType;
  start_date?: string;
  end_date?: string;
  total_days?: number;
  work_days?: number;
  comment?: string;
  status?: VacationStatus;
}

export interface VacationPlan {
  id: string;
  user_id: string;
  user?: User;
  year: number;
  planned_dates: any[];
  preferred_months: number[];
  notes?: string;
  is_confirmed: boolean;
  confirmed_by_id?: string;
  confirmed_by?: User;
  confirmation_date?: string;
}

export interface VacationTransfer {
  id: string;
  vacation_id?: string;
  vacation?: Vacation;
  user_id: string;
  user?: User;
  original_start_date: string;
  original_end_date: string;
  original_days: number;
  new_start_date: string;
  new_end_date: string;
  new_days: number;
  transfer_reason?: string;
  status: VacationStatus;
  initiated_by_id: string;
  initiated_by?: User;
  approved_by_id?: string;
  approved_by?: User;
  approval_date?: string;
}

export interface VacationBalance {
  id: string;
  user_id: string;
  user?: User;
  year: number;
  initial_balance: number;
  earned: number;
  used: number;
  transferred_from_previous: number;
  transferred_to_next: number;
  expired: number;
  current_balance: number;
  monthly_accruals: any;
  last_accrual_date?: string;
  next_accrual_date?: string;
  is_active: boolean;
  accrual_paused: boolean;
}

export interface CompanyHoliday {
  id: string;
  name: string;
  description?: string;
  date: string;
  is_recurring: boolean;
  year?: number;
  is_day_off: boolean;
  is_short_day: boolean;
  created_by_id?: string;
  created_by?: User;
}

export interface DashboardStats {
  total_vacations: number;
  total_days_used: number;
  monthly_vacations: { [key: number]: number };
  by_type: Array<{
    type: string;
    count: number;
    days: number;
  }>;
}

export interface UserVacationSummary {
  user: User;
  current_year_balance?: VacationBalance;
  used_days_current_year: number;
  planned_vacations: Vacation[];
  pending_approvals: Vacation[];
}

export enum VacationType {
  ANNUAL = 'annual',
  UNPAID = 'unpaid',
  SICK = 'sick',
  MATERNITY = 'maternity',
  STUDY = 'study',
  OTHER = 'other'
}

export enum VacationStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TRANSFERRED = 'transferred'
}

export interface VacationFilters {
  user_id?: string;
  status?: VacationStatus;
  year?: number;
  store_id?: string;
  department?: string;
  vacation_type?: VacationType;
}

export interface QuickCheckResponse {
  user: {
    id: string;
    name: string;
    department: string;
    store_id?: string;
  };
  requested_period: {
    start_date: string;
    end_date: string;
    days_count: number;
    weeks_count: number;
    months_included: string[];
  };
  is_available: boolean;
  department_check: any;
  store_check: any;
  seasonal_check: any;
  overlap_check: any;
  recommendations: string[];
}

export interface CalendarAvailabilityResponse {
  year: number;
  month: number;
  month_name: string;
  user: {
    id: string;
    name: string;
  };
  calendar_days: Array<{
    date: string;
    day: number;
    weekday: number;
    is_weekend: boolean;
    season: string;
    season_name: string;
    status: string;
    color: string;
    reason: string[];
    restriction_types: string[];
    is_today: boolean;
  }>;
  statistics: any;
  store_restrictions_info: any;
  seasonal_availability: any;
  unavailable_periods_count: number;
  legend: any;
}

export interface UnavailablePeriodsResponse {
  user: any;
  analysis_period: any;
  department_limits: any;
  store_limits: any;
  unavailable_periods: any[];
  recommended_periods: any[];
  seasonal_availability: any;
  seasonal_recommendations: string[];
  statistics: any;
}