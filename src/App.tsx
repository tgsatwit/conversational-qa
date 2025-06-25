import React, { useState } from 'react';
import LoanApprovalForm, { LoanDecision } from './components/LoanApprovalForm';
import QualityCoach from './components/QualityCoach';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { ArrowRight, CheckCircle2, MessageSquare, FileText, RefreshCw, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const [loanDecision, setLoanDecision] = useState<LoanDecision | null>(null);
  const [qaSessionStarted, setQASessionStarted] = useState(false);
  const [qaSessionCompleted, setQASessionCompleted] = useState(false);
  const [showQualityCoach, setShowQualityCoach] = useState(false);

  const handleLoanSubmission = (decision: LoanDecision) => {
    setLoanDecision(decision);
    // Trigger quality coach to slide in after a short delay
    setTimeout(() => {
      setShowQualityCoach(true);
    }, 500);
  };

  const startNewApplication = () => {
    setLoanDecision(null);
    setQASessionStarted(false);
    setQASessionCompleted(false);
    setShowQualityCoach(false);
  };

  const handleQAStart = () => {
    setQASessionStarted(true);
  };

  const handleQAComplete = () => {
    setQASessionCompleted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground/90">Conversational QA Prototype</h1>
              <p className="text-muted-foreground/80 mt-1">
                Voice-first quality assurance for loan approval decisions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {loanDecision && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={startNewApplication}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>New Application</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 mt-8">
            <motion.div 
              className={`flex items-center space-x-3 ${
                !loanDecision ? 'text-blue-600' : 'text-green-600'
              }`}
              animate={{ scale: !loanDecision ? 1.05 : 1 }}
              transition={{ repeat: !loanDecision ? Infinity : 0, repeatType: "reverse", duration: 1.5 }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                !loanDecision ? 'glass-primary text-white shadow-lg shadow-blue-500/25' : 'glass-success text-white shadow-lg shadow-green-500/25'
              }`}>
                {!loanDecision ? '1' : '✓'}
              </div>
              <span className="font-medium">Loan Decision</span>
            </motion.div>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: loanDecision ? 1 : 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="w-12 h-1 glass-success rounded-full origin-left"
            />
            
            <motion.div 
              className={`flex items-center space-x-3 ${
                !loanDecision ? 'text-gray-400' : 
                !qaSessionCompleted ? 'text-blue-600' : 'text-green-600'
              }`}
              animate={{ scale: loanDecision && !qaSessionCompleted ? 1.05 : 1 }}
              transition={{ repeat: loanDecision && !qaSessionCompleted ? Infinity : 0, repeatType: "reverse", duration: 1.5 }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ${
                !loanDecision ? 'glass bg-gray-200/50 text-gray-400' : 
                !qaSessionCompleted ? 'glass-primary text-white shadow-lg shadow-blue-500/25' : 'glass-success text-white shadow-lg shadow-green-500/25'
              }`}>
                {!loanDecision ? '2' : qaSessionCompleted ? '✓' : '2'}
              </div>
              <span className="font-medium">Quality Review</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Loan Form */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <div className="glass p-1 rounded-2xl border border-white/20">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 glass-primary rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground/90">Loan Application Form</h2>
                    <p className="text-muted-foreground/80">Complete the loan decision form</p>
                  </div>
                </div>
                
                <LoanApprovalForm 
                  onSubmit={handleLoanSubmission} 
                  isSubmitted={false}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Review & QA */}
          <div className="space-y-6">
            {!loanDecision ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass p-1 rounded-2xl border border-white/20 border-dashed">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
                    <div className="text-center py-16 text-muted-foreground/60">
                      <div className="w-20 h-20 glass rounded-full mx-auto mb-6 flex items-center justify-center">
                        <FileText className="h-10 w-10 opacity-30" />
                      </div>
                      <p className="text-lg font-medium mb-2">Complete the loan form</p>
                      <p className="text-sm">
                        Your loan review and QA session will appear here once you submit the form.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Loan Application Review */}
                <motion.div
                  key="loan-review"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass p-1 rounded-2xl border border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-10 h-10 glass-success rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground/90">Loan Application Review</h3>
                          <p className="text-muted-foreground/80 text-sm">Decision submitted successfully</p>
                        </div>
                      </div>
                      
                      {/* Key Decision Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 glass rounded-xl border border-green-300/30">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {loanDecision.decision.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground/70">Decision</div>
                        </div>
                        <div className="text-center p-4 glass rounded-xl border border-green-300/30">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {loanDecision.riskLevel.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground/70">Risk Level</div>
                        </div>
                      </div>

                      {/* Application Summary */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-foreground/90 font-semibold">Application Summary</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">Applicant:</strong> {loanDecision.applicantName}
                          </div>
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">Amount:</strong> ${loanDecision.loanAmount.toLocaleString()}
                          </div>
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">Credit:</strong> {loanDecision.creditScore}
                          </div>
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">Income:</strong> ${loanDecision.annualIncome.toLocaleString()}
                          </div>
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">DTI:</strong> {loanDecision.debtToIncomeRatio}%
                          </div>
                          <div className="text-foreground/80">
                            <strong className="text-foreground/90">Employment:</strong> {loanDecision.employmentYears} years
                          </div>
                        </div>
                      </div>

                      {/* Decision Reasoning */}
                      {loanDecision.reasoning && (
                        <div className="space-y-3 mb-6">
                          <h4 className="text-foreground/90 font-semibold">Decision Rationale</h4>
                          <div className="p-4 glass rounded-xl text-sm text-foreground/80 border border-white/20">
                            {loanDecision.reasoning}
                          </div>
                        </div>
                      )}

                      {/* Conditions if applicable */}
                      {loanDecision.decision === 'conditional' && loanDecision.conditions && (
                        <div className="space-y-3">
                          <h4 className="text-foreground/90 font-semibold">Approval Conditions</h4>
                          <div className="p-4 glass rounded-xl text-sm text-foreground/80 border border-yellow-300/30 bg-yellow-50/20">
                            {loanDecision.conditions}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Quality Assurance Session */}
                <motion.div
                  key="qa-session"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="glass p-1 rounded-2xl border border-white/20">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-10 h-10 glass-primary rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground/90">Quality Assurance</h3>
                          <p className="text-muted-foreground/80 text-sm">
                            {!qaSessionStarted ? "Ready to begin QA session" : 
                             qaSessionCompleted ? "Session completed" : "Session in progress"}
                          </p>
                        </div>
                      </div>

                      {!showQualityCoach ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600/30 border-t-blue-600 mx-auto mb-4"></div>
                          <p className="text-sm text-muted-foreground/80">Preparing your QA session...</p>
                        </div>
                      ) : (
                        <QualityCoach 
                          loanDecision={loanDecision}
                          onComplete={handleQAComplete}
                          onStart={handleQAStart}
                          isStarted={qaSessionStarted}
                          isVisible={showQualityCoach}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Session Complete Summary */}
                {qaSessionCompleted && (
                  <motion.div
                    key="session-complete"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass p-1 rounded-2xl border border-white/20">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-10 h-10 glass-success rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground/90">Session Complete</h3>
                            <p className="text-muted-foreground/80 text-sm">Great job completing the QA session!</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 text-sm">
                          <div className="glass p-4 rounded-xl border border-white/20">
                            <h5 className="text-foreground/90 font-medium mb-3">Summary</h5>
                            <ul className="space-y-2 text-muted-foreground/80">
                              <li className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span>Insights gathered ✓</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span>Recommendations ready ✓</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                <span>Documentation improved ✓</span>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                          <Button 
                            onClick={startNewApplication}
                            className="flex items-center space-x-2"
                            size="sm"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Start New Application</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}