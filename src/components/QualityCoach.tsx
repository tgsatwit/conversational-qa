import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import AudioRecorder from './AudioRecorder';
import { LoanDecision } from './LoanApprovalForm';
import { MessageSquare, Bot, User, Download, Play, CheckCircle2, AlertCircle, FileEdit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationTurn {
  speaker: 'ai' | 'user';
  message: string;
  timestamp: Date;
  audioUrl?: string;
}

interface Recommendation {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface QualityCoachProps {
  loanDecision: LoanDecision;
  onComplete: () => void;
  onStart: () => void;
  isStarted: boolean;
  isVisible: boolean;
}

// Mock API functions
const mockSpeechToText = async (audioBlob: Blob): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockResponses = [
    "I approved the loan because the credit score of 720 is above our minimum threshold and the debt-to-income ratio is reasonable at 28%. The applicant has stable employment for over 3 years.",
    "Yes, I considered the loan-to-value ratio. With a home value of $500,000 and loan amount of $450,000, the LTV is 90%, which is within our guidelines for this credit profile.",
    "I think the main risks are the relatively short employment history and the high loan amount relative to income. But the strong credit score and down payment help mitigate these concerns."
  ];
  
  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

const mockTextToSpeech = async (text: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'data:audio/wav;base64,mock-audio-data';
};

const generateQAPrompt = (decision: LoanDecision, turnNumber: number): string => {
  const prompts = [
    `I'd like to understand your reasoning for ${decision.decision === 'approve' ? 'approving' : decision.decision === 'deny' ? 'denying' : 'conditionally approving'} this loan for ${decision.applicantName}. Can you walk me through the key factors that influenced your decision?`,
    
    `That's helpful context. Given that the loan amount is $${decision.loanAmount.toLocaleString()} against an income of $${decision.annualIncome.toLocaleString()}, did you consider the payment-to-income ratio in your analysis?`,
    
    `Looking at this application holistically, what do you see as the primary risk factors, and how did you weigh them against the positive indicators?`
  ];
  
  return prompts[Math.min(turnNumber, prompts.length - 1)];
};

const generateRecommendations = (decision: LoanDecision): Recommendation[] => {
  const baseRecommendations = [
    {
      id: '1',
      text: 'Update rationale to include specific LTV calculation (90%)',
      completed: false,
      priority: 'high' as const
    },
    {
      id: '2', 
      text: 'Document consideration of employment stability vs. loan amount',
      completed: false,
      priority: 'medium' as const
    },
    {
      id: '3',
      text: 'Add note about comparable market analysis for collateral valuation',
      completed: false,
      priority: 'medium' as const
    }
  ];

  if (decision.decision === 'conditional') {
    baseRecommendations.push({
      id: '4',
      text: 'Specify timeline for condition fulfillment',
      completed: false,
      priority: 'high' as const
    });
  }

  if (decision.riskLevel === 'medium' || decision.riskLevel === 'high') {
    baseRecommendations.push({
      id: '5',
      text: 'Schedule follow-up review in 6 months',
      completed: false,
      priority: 'low' as const
    });
  }

  return baseRecommendations;
};

export default function QualityCoach({ loanDecision, onComplete, onStart, isStarted, isVisible }: QualityCoachProps) {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const startSession = async () => {
    onStart();
    setIsProcessing(true);
    
    const firstPrompt = generateQAPrompt(loanDecision, 0);
    
    try {
      const audioUrl = await mockTextToSpeech(firstPrompt);
      
      const aiTurn: ConversationTurn = {
        speaker: 'ai',
        message: firstPrompt,
        timestamp: new Date(),
        audioUrl
      };
      
      setConversation([aiTurn]);
      playAudio(audioUrl);
      
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
      setIsListening(true);
    }, 3000);
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsListening(false);
    setIsProcessing(true);
    
    try {
      const transcription = await mockSpeechToText(audioBlob);
      
      const userTurn: ConversationTurn = {
        speaker: 'user',
        message: transcription,
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, userTurn]);
      
      if (currentTurn < 2) {
        const nextPrompt = generateQAPrompt(loanDecision, currentTurn + 1);
        const audioUrl = await mockTextToSpeech(nextPrompt);
        
        const aiTurn: ConversationTurn = {
          speaker: 'ai',
          message: nextPrompt,
          timestamp: new Date(),
          audioUrl
        };
        
        setConversation(prev => [...prev, aiTurn]);
        setCurrentTurn(prev => prev + 1);
        playAudio(audioUrl);
      } else {
        endSession();
      }
      
    } catch (error) {
      console.error('Error processing recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const endSession = async () => {
    setIsProcessing(true);
    
    const closingMessage = "Thank you for that reflection. This concludes our QA conversation. I've generated some recommendations for you to review.";
    
    try {
      const audioUrl = await mockTextToSpeech(closingMessage);
      
      const closingTurn: ConversationTurn = {
        speaker: 'ai',
        message: closingMessage,
        timestamp: new Date(),
        audioUrl
      };
      
      setConversation(prev => [...prev, closingTurn]);
      playAudio(audioUrl);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsPlaying(false);
        setSessionCompleted(true);
        
        // Generate and show recommendations
        const recs = generateRecommendations(loanDecision);
        setRecommendations(recs);
        setShowRecommendations(true);
        onComplete();
      }, 3000);
      
    } catch (error) {
      console.error('Error ending session:', error);
      setIsProcessing(false);
    }
  };

  const toggleRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, completed: !rec.completed } : rec
      )
    );
  };

  const downloadTranscript = () => {
    const transcript = conversation.map(turn => 
      `[${turn.timestamp.toLocaleTimeString()}] ${turn.speaker.toUpperCase()}: ${turn.message}`
    ).join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-session-${loanDecision.applicantName}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <FileEdit className="h-4 w-4" />;
      case 'low': return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="space-y-6"
        >
          <div className="space-y-6">
              {!isStarted ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button onClick={startSession} className="w-full" size="lg">
                      <Play className="mr-2 h-5 w-5" />
                      Start QA Session
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Conversation History */}
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    <AnimatePresence>
                      {conversation.map((turn, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] p-4 rounded-xl ${
                            turn.speaker === 'ai' 
                              ? 'glass border border-blue-300/30 text-foreground/90' 
                              : 'glass-button border border-white/30 text-foreground/90'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              {turn.speaker === 'ai' ? (
                                <div className="w-6 h-6 glass-primary rounded-full flex items-center justify-center">
                                  <Bot className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 glass rounded-full flex items-center justify-center">
                                  <User className="h-3 w-3 text-foreground/60" />
                                </div>
                              )}
                              <span className="text-xs opacity-70">
                                {turn.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{turn.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {conversation.length > 0 && <Separator className="bg-white/20" />}

                  {/* Audio Controls */}
                  {!sessionCompleted && (
                    <div className="text-center">
                      <AudioRecorder
                        onRecordingComplete={handleRecordingComplete}
                        onPlayAudio={playAudio}
                        isListening={isListening}
                        isPlaying={isPlaying}
                        disabled={isProcessing}
                      />
                      
                      {isProcessing && (
                        <motion.p 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-muted-foreground/70 mt-3"
                        >
                          Processing your response...
                        </motion.p>
                      )}
                    </div>
                  )}

                  {/* Session Complete Actions */}
                  {sessionCompleted && (
                    <div className="flex justify-center pt-4 border-t border-white/20">
                      <Button 
                        variant="outline" 
                        onClick={downloadTranscript}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Transcript</span>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

          {/* Recommendations Card */}
          <AnimatePresence>
            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', damping: 20 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-10 h-10 glass-primary rounded-full flex items-center justify-center">
                        <FileEdit className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-blue-600">Recommended Actions</span>
                      <Badge variant="outline" className="ml-auto">
                        {recommendations.filter(r => r.completed).length}/{recommendations.length} Complete
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Based on your conversation, here are actions to strengthen your decision documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <motion.div
                          key={rec.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className={`flex items-start space-x-4 p-4 rounded-xl border transition-all ${
                            rec.completed 
                              ? 'glass border-green-300/30 bg-green-50/20' 
                              : 'glass border-white/20 hover:border-white/40'
                          }`}
                        >
                          <Checkbox
                            checked={rec.completed}
                            onCheckedChange={() => toggleRecommendation(rec.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={getPriorityColor(rec.priority)}>
                                {getPriorityIcon(rec.priority)}
                              </span>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(rec.priority)}`}>
                                {rec.priority.toUpperCase()}
                              </Badge>
                            </div>
                            <p className={`text-sm ${rec.completed ? 'line-through text-muted-foreground/60' : 'text-foreground/90'}`}>
                              {rec.text}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}