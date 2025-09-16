/**
 * User type definition to resolve ProfileEdit component conflicts
 * This matches the database schema for the users table
 */
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  vetting_status?: string;
  profile_photo_url?: string;
  headline?: string;
  profile_status?: string;
  status?: string;
  t_and_c_accepted?: boolean;
  profile_complete_pct?: number;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
