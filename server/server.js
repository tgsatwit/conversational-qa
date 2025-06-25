import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// SOP Content (same as frontend)
const SOP_CONTEXT = `
# Standard Operating Procedure: Loan Decisioning Process

## KEY REQUIREMENTS AND THRESHOLDS:

### Credit Score Requirements:
- Conventional: Minimum 620, LTV ≤ 95%, DTI ≤ 45%
- Jumbo: Minimum 700, LTV ≤ 80%, 6 months reserves
- Investment Property: Minimum 680, LTV ≤ 75%, 12 months reserves

### DTI Ratio Thresholds:
- Front-End Ratio (Housing Only): Maximum 28%
- Back-End Ratio (Total Debt): Maximum 43%
- Exception Allowed: Up to 50% with compensating factors

### LTV Ratio Limits:
- Primary Residence: Up to 95%
- Second Home: Up to 90%
- Investment Property: Up to 75%

### Employment Requirements:
- Minimum 2 years in same field
- No gaps > 30 days in past 24 months
- Income calculation: 2-year average for W-2 employees

### Automatic Approval Criteria (ALL must be met):
- Credit Score ≥ 740
- DTI Ratio ≤ 36%
- LTV Ratio ≤ 80%
- Employment History ≥ 2 years
- No bankruptcies, foreclosures, or collections in past 7 years
- Verified assets ≥ 120% of required

### Denial Criteria (ANY applies):
- Credit Score < 580
- DTI Ratio > 50% (regardless of compensating factors)
- Bankruptcy discharge < 2 years
- Foreclosure < 3 years
- Unable to verify income or employment
- Insufficient funds for down payment

### Risk Assessment Matrix:
| Factor | Low Risk | Medium Risk | High Risk |
|--------|----------|-------------|-----------|
| Credit Score | >720 | 660-719 | <660 |
| DTI | <30% | 30-40% | >40% |
| LTV | <70% | 70-85% | >85% |
| Employment | >5 years | 2-5 years | <2 years |

### Decision Rationale Requirements:
- Must confirm all ratios within guidelines
- Minimum 3 specific strengths for approvals
- How risks are mitigated
- Policy compliance confirmation
- For conditionals: numbered conditions with clear requirements
- For denials: primary reason with policy reference

### Compensating Factors:
Strong factors (can offset 1 weakness):
- Assets > 20% of loan amount
- Credit score > 780
- LTV < 60%

Moderate factors (2 required to offset 1 weakness):
- Stable employment > 10 years
- No debt besides mortgage
- Cash reserves > 12 months
`;

// Quality check endpoint
app.post('/api/quality-check', async (req, res) => {
  try {
    const { loanDecision } = req.body;

    if (!loanDecision) {
      return res.status(400).json({ 
        error: 'Loan decision data is required' 
      });
    }

    const systemPrompt = `You are an experienced Operations Quality Assurance specialist with 15+ years in mortgage lending and underwriting. You are an expert at identifying potential errors, policy violations, and areas for improvement in loan decisioning.

Your role is to conduct a comprehensive quality assurance review of loan decisions, assessments, and rationales based strictly on the Standard Operating Procedure (SOP) provided as the authoritative source of truth.

CRITICAL INSTRUCTIONS:
1. The SOP is your ONLY source of truth for policy requirements
2. Identify ANY deviations from SOP requirements as issues
3. Provide constructive feedback to help operators improve
4. Recognize what has been done correctly according to the SOP
5. Be thorough but practical in your assessment
6. Focus on compliance, risk management, and decision quality

ASSESSMENT CRITERIA:
- Policy Compliance: Does the decision follow SOP requirements?
- Risk Assessment: Is the risk level appropriate for the application profile?
- Decision Rationale: Is the reasoning complete, clear, and well-supported?
- Calculation Accuracy: Are DTI, LTV, and other ratios calculated correctly?
- Documentation Quality: Are all required elements present and adequate?
- Regulatory Compliance: Does the decision meet fair lending and other regulatory requirements?

Provide specific, actionable feedback with SOP references where applicable.

SOP (SOURCE OF TRUTH):
${SOP_CONTEXT}`;

    const userPrompt = `Please conduct a comprehensive quality assurance review of this loan decision:

**APPLICATION DETAILS:**
- Applicant: ${loanDecision.applicantName}
- Loan Amount: $${loanDecision.loanAmount.toLocaleString()}
- Annual Income: $${loanDecision.annualIncome.toLocaleString()}
- Credit Score: ${loanDecision.creditScore}
- Debt-to-Income Ratio: ${loanDecision.debtToIncomeRatio}%
- Collateral Value: $${loanDecision.collateralValue.toLocaleString()}
- Employment Years: ${loanDecision.employmentYears}

**DECISION:**
- Decision: ${loanDecision.decision.toUpperCase()}
- Risk Level: ${loanDecision.riskLevel.toUpperCase()}

**DECISION RATIONALE:**
${loanDecision.reasoning || "No rationale provided"}

**CONDITIONS (if applicable):**
${loanDecision.conditions || "None specified"}

Based on the SOP requirements, analyze this decision for:
1. Policy compliance violations
2. Risk assessment accuracy
3. Decision rationale quality
4. Missing or inadequate documentation
5. Calculation errors
6. Areas of strength and good practice

Provide your assessment in the following JSON format:
{
  "issues": [
    {
      "id": "unique_id",
      "category": "decision|risk|rationale|conditions|calculation|compliance",
      "severity": "critical|warning|info",
      "title": "Clear issue title",
      "description": "Detailed description of the issue",
      "suggestion": "Specific action to resolve the issue",
      "sopReference": "Relevant SOP section (optional)"
    }
  ],
  "strengths": [
    "List of things done correctly according to SOP"
  ],
  "overallAssessment": "Summary of the overall quality and compliance",
  "complianceScore": 85
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(response);
    
    // Add unique IDs if not provided
    result.issues = result.issues.map((issue, index) => ({
      ...issue,
      id: issue.id || `ai-issue-${index + 1}`
    }));

    res.json(result);

  } catch (error) {
    console.error('Error in quality check:', error);
    
    // Return fallback response
    res.status(500).json({
      issues: [{
        id: 'api-error',
        category: 'compliance',
        severity: 'warning',
        title: 'AI Quality Check Unavailable',
        description: 'Unable to perform AI-powered quality check. Please review manually according to SOP.',
        suggestion: 'Check server configuration or try again later.'
      }],
      strengths: ['Decision submitted for review'],
      overallAssessment: 'AI quality check temporarily unavailable. Manual review recommended.',
      complianceScore: 0
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Conversational QA Backend' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
}); 