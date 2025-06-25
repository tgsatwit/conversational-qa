import { LoanDecision } from '../components/LoanApprovalForm';

// Backend API configuration
// @ts-ignore - Vite handles import.meta.env at build time
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AIQualityCheckIssue {
  id: string;
  category: 'decision' | 'risk' | 'rationale' | 'conditions' | 'calculation' | 'compliance';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
  sopReference?: string;
}

export interface AIQualityCheckResult {
  issues: AIQualityCheckIssue[];
  strengths: string[];
  overallAssessment: string;
  complianceScore: number; // 0-100
}

export async function performAIQualityCheck(loanDecision: LoanDecision): Promise<AIQualityCheckResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quality-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ loanDecision })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const result: AIQualityCheckResult = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error calling backend API:', error);
    
    // Fallback response in case of API error
    return {
      issues: [{
        id: 'api-error',
        category: 'compliance',
        severity: 'warning',
        title: 'AI Quality Check Unavailable',
        description: 'Unable to perform AI-powered quality check. Please review manually according to SOP.',
        suggestion: 'Check API configuration or try again later.'
      }],
      strengths: ['Decision submitted for review'],
      overallAssessment: 'AI quality check temporarily unavailable. Manual review recommended.',
      complianceScore: 0
    };
  }
} 