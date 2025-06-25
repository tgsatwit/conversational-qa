import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { CheckCircle2, FileText } from 'lucide-react';

export interface LoanDecision {
  applicantName: string;
  loanAmount: number;
  creditScore: number;
  annualIncome: number;
  debtToIncomeRatio: number;
  employmentYears: number;
  loanPurpose: string;
  collateralValue: number;
  decision: 'approve' | 'deny' | 'conditional';
  reasoning: string;
  conditions?: string;
  riskLevel: 'low' | 'medium' | 'high';
  followUpRequired: boolean;
}

interface LoanApprovalFormProps {
  onSubmit: (decision: LoanDecision) => void;
  isSubmitted: boolean;
  onUnlock?: () => void;
}

export default function LoanApprovalForm({ onSubmit, isSubmitted, onUnlock }: LoanApprovalFormProps) {
  const [formData, setFormData] = useState<LoanDecision>({
    applicantName: 'Sarah Chen',
    loanAmount: 450000,
    creditScore: 720,
    annualIncome: 95000,
    debtToIncomeRatio: 28,
    employmentYears: 3.5,
    loanPurpose: 'home_purchase',
    collateralValue: 500000,
    decision: 'approve',
    reasoning: '',
    conditions: '',
    riskLevel: 'medium',
    followUpRequired: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof LoanDecision, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };



  return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Application Overview */}
          <div className="glass p-5 rounded-xl border border-white/30">
            <h4 className="mb-4 font-semibold text-foreground/90">Application Overview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">Applicant</Label>
                <div className="text-foreground/90 font-medium">{formData.applicantName}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">Loan Amount</Label>
                <div className="text-foreground/90 font-medium">${formData.loanAmount.toLocaleString()}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">Credit Score</Label>
                <div className="text-foreground/90 font-medium">{formData.creditScore}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">Annual Income</Label>
                <div className="text-foreground/90 font-medium">${formData.annualIncome.toLocaleString()}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">DTI Ratio</Label>
                <div className="text-foreground/90 font-medium">{formData.debtToIncomeRatio}%</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground/80 font-medium">Employment</Label>
                <div className="text-foreground/90 font-medium">{formData.employmentYears} years</div>
              </div>
            </div>
          </div>

          {/* Decision Section */}
          <div className="space-y-6">
              
            <div className="space-y-4">
              <Label className="text-base font-medium">Loan Decision</Label>
              <RadioGroup
                value={formData.decision}
                onValueChange={(value) => updateField('decision', value)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-white/30 hover:border-green-300/50 transition-all">
                  <RadioGroupItem value="approve" id="approve" />
                  <Label htmlFor="approve" className="cursor-pointer flex-1 font-medium">Approve</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-white/30 hover:border-yellow-300/50 transition-all">
                  <RadioGroupItem value="conditional" id="conditional" />
                  <Label htmlFor="conditional" className="cursor-pointer flex-1 font-medium">Conditional Approval</Label>
                </div>
                <div className="flex items-center space-x-3 p-3 glass rounded-lg border border-white/30 hover:border-red-300/50 transition-all">
                  <RadioGroupItem value="deny" id="deny" />
                  <Label htmlFor="deny" className="cursor-pointer flex-1 font-medium">Deny</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="riskLevel" className="text-base font-medium">Risk Assessment</Label>
              <Select value={formData.riskLevel} onValueChange={(value) => updateField('riskLevel', value)}>
                <SelectTrigger className="glass border-white/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border border-white/30">
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="reasoning" className="text-base font-medium">Decision Rationale (Required)</Label>
              <Textarea
                id="reasoning"
                placeholder="Explain your decision based on the application data and company guidelines..."
                value={formData.reasoning}
                onChange={(e) => updateField('reasoning', e.target.value)}
                required
                rows={4}
                className="glass border-white/30 placeholder:text-muted-foreground/60"
              />
            </div>

            {formData.decision === 'conditional' && (
              <div className="space-y-3">
                <Label htmlFor="conditions" className="text-base font-medium">Approval Conditions</Label>
                <Textarea
                  id="conditions"
                  placeholder="List the conditions that must be met for final approval..."
                  value={formData.conditions}
                  onChange={(e) => updateField('conditions', e.target.value)}
                  rows={3}
                  className="glass border-white/30 placeholder:text-muted-foreground/60"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Submit Decision
          </Button>
        </form>
  );
}