import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import AudioRecorder from './AudioRecorder';
import { LoanDecision } from './LoanApprovalForm';
import { MessageSquare, Bot, User, Download, Play } from 'lucide-react';

interface ConversationTurn {
  speaker: 'ai' | 'user';
  message: string;
  timestamp: Date;
  audioUrl?: string;
}

interface VoiceQASessionProps {
  loanDecision: LoanDecision;
  onComplete: () => void;
  onStart: () => void;
  isStarted: boolean;
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

export default function VoiceQASession({ loanDecision, onComplete, onStart, isStarted }: VoiceQASessionProps) {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

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
    
    const closingMessage = "Thank you for that reflection. This concludes our QA conversation. Your responses have been recorded for review and training purposes.";
    
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
        onComplete();
      }, 3000);
      
    } catch (error) {
      console.error('Error ending session:', error);
      setIsProcessing(false);
    }
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

  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span>Voice QA Session</span>
          </CardTitle>
          <CardDescription>
            Ready to start your voice-based quality assurance conversation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="mb-2">What to Expect:</h4>
            <ul className="text-sm space-y-1">
              <li>• The AI will ask 2-3 coaching questions</li>
              <li>• Respond naturally via voice</li>
              <li>• Takes about 2-3 minutes total</li>
              <li>• Get a transcript at the end</li>
            </ul>
          </div>
          <Button onClick={startSession} className="w-full" size="lg">
            <Play className="mr-2 h-4 w-4" />
            Start QA Conversation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <span>Voice QA Session</span>
          </div>
          {!sessionCompleted && (
            <Badge variant="outline">Turn {currentTurn + 1} of 3</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Conversational QA for {loanDecision.applicantName}'s loan application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conversation History */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {conversation.map((turn, index) => (
            <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg ${
                turn.speaker === 'ai' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  {turn.speaker === 'ai' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {turn.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{turn.message}</p>
              </div>
            </div>
          ))}
        </div>

        {conversation.length > 0 && <Separator />}

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
              <p className="text-sm text-muted-foreground mt-2">
                Processing your response...
              </p>
            )}
          </div>
        )}

        {/* Session Complete Actions */}
        {sessionCompleted && (
          <div className="flex justify-center pt-4 border-t">
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
      </CardContent>
    </Card>
  );
}