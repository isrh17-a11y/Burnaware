export interface User {
  id: number;
  user_id?: number; // For backward compatibility with backend
  email: string;
  name: string;
  username?: string;
  full_name?: string;
  created_at: string;
}

export interface AssessmentData {
  stress_level: number;
  work_hours: number;
  sleep_hours: number;
  physical_activity: number;
  social_support: number;
  work_life_balance: number;
}

export interface BurnoutPrediction {
  burnout_score: number;
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface BurnoutHistory {
  date: string;
  score: number;
  sleep_hours: number;
  stress_level: number;
}

export interface Goal {
  id: number;
  title: string;
  description?: string;
  category: 'career' | 'wellness' | 'personal' | 'financial';
  is_completed: boolean;
  target_date?: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  earned_at?: string;
}

export interface Streak {
  current_streak: number;
  longest_streak: number;
}

export interface GamificationProfile {
  points: number;
  level: number;
  streak: Streak | null;
  achievements: Achievement[];
}

export interface MoodActivity {
  id: number;
  title: string;
  category: string;
  duration_mins: number;
  is_completed: boolean;
}

export interface MoodResponse {
  reassurance_message: string;
  suggested_activities: MoodActivity[];
}
