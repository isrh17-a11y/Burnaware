import axios from 'axios';
import { AssessmentData, BurnoutPrediction, ChatMessage, User } from './types';

const API_BASE_URL = 'http://localhost:10000';

// Create axios instance with default config
// Extended timeout for Render cold starts (free tier can take 30-60 seconds to wake up)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds to handle cold starts
  headers: {
    'Content-Type': 'application/json',
  },
});

export class ApiClient {
  // User Authentication
  static async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post('/api/users/login', { email, password });
    return response.data;
  }

  static async register(email: string, password: string, name: string): Promise<User> {
    const response = await apiClient.post('/api/users/register', { 
      email, 
      password, 
      username: email.split('@')[0], // Use email prefix as username
      full_name: name 
    });
    return response.data;
  }

  // Burnout Assessment - POST to /api/predictions with user_id query param
  static async submitAssessment(data: AssessmentData, userId: number): Promise<BurnoutPrediction> {
    // Transform frontend data to match backend schema
    const backendData = {
      work_hours_per_week: data.work_hours * 7, // Convert daily hours to weekly
      sleep_hours_per_day: data.sleep_hours,
      stress_level: data.stress_level,
      job_satisfaction: Math.max(1, 10 - data.stress_level), // Ensure min 1 (backend constraint)
      work_life_balance: data.work_life_balance,
      physical_activity_hours: data.physical_activity,
      social_support: data.social_support,
    };

    console.log('Submitting assessment for userId:', userId);
    console.log('Assessment payload:', backendData);
    
    try {
      const response = await apiClient.post(
        `/api/predictions?user_id=${userId}`,
        backendData
      );
      
      return {
        burnout_score: response.data.burnout_score,
        risk_level: response.data.risk_level as 'low' | 'medium' | 'high',
        recommendations: response.data.recommendations || [],
        timestamp: response.data.created_at,
      };
    } catch (error: any) {
      console.error('Assessment Submission Error Details:', error.response?.data);
      throw error;
    }
  }

  static async getBurnoutHistory(userId: number): Promise<BurnoutPrediction[]> {
    const response = await apiClient.get(`/api/predictions/user/${userId}`);
    return response.data.map((item: any) => ({
      burnout_score: item.burnout_score,
      risk_level: item.risk_level,
      recommendations: item.recommendations || [],
      timestamp: item.created_at,
    }));
  }



  // Health Check
  static async healthCheck(): Promise<{ status: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  static async sendChatMessage(message: string, userId: number): Promise<any> {
    const response = await apiClient.post(`/api/chatbot/chat?user_id=${userId}`, {
      message,
    });
    return response.data;
  }
}

