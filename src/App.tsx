import React, { useState } from 'react';
import LoanApprovalForm, { LoanDecision } from './components/LoanApprovalForm';
import QualityCoach from './components/QualityCoach';
import { Button } from './components/ui/button';
import { CheckCircle2, MessageSquare, FileText, RefreshCw, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

// SOP content imported as a constant
const SOP_CONTENT = `# Standard Operating Procedure: Loan Decisioning Process

**Document ID:** SOP-LD-001  
**Version:** 2.0  
**Effective Date:** [Current Date]  
**Department:** Credit Risk Management  
**Process Owner:** Chief Credit Officer  
**Last Review Date:** [Review Date]

---

## 1. PURPOSE

This Standard Operating Procedure (SOP) establishes the standardized process for evaluating and decisioning loan applications to ensure consistent, compliant, and risk-appropriate lending decisions across all channels and products.

## 2. SCOPE

This SOP applies to all loan officers, underwriters, and credit analysts involved in the evaluation and approval of:
- Residential mortgage loans
- Home equity loans and lines of credit
- Commercial real estate loans
- Personal loans over $100,000

## 3. DEFINITIONS

- **DTI (Debt-to-Income Ratio):** The percentage of gross monthly income that goes toward paying monthly debt obligations
- **LTV (Loan-to-Value Ratio):** The ratio of loan amount to collateral value
- **FICO Score:** Standardized credit score ranging from 300-850
- **Compensating Factors:** Positive attributes that offset weaknesses in the application
- **PITI:** Principal, Interest, Taxes, and Insurance
- **VOE:** Verification of Employment
- **VOD:** Verification of Deposit
- **AUS:** Automated Underwriting System

## 4. RESPONSIBILITIES

### 4.1 Loan Officer
- Complete initial application review
- Verify all documentation
- Perform preliminary risk assessment
- Submit recommendation

### 4.2 Credit Analyst
- Validate financial calculations
- Verify employment and income
- Review credit report details
- Assess collateral adequacy

### 4.3 Senior Underwriter
- Review high-risk applications
- Approve exceptions to policy
- Provide final decision on complex cases

## 5. DETAILED CALCULATION INSTRUCTIONS

### 5.1 Debt-to-Income (DTI) Ratio Calculations

#### 5.1.1 Front-End DTI (Housing Ratio)
**Formula:** (Total Monthly Housing Payment ÷ Gross Monthly Income) × 100

**Step-by-Step Calculation:**
1. Calculate Total Monthly Housing Payment (PITI):
   - Principal & Interest: Use loan amortization calculator
   - Property Taxes: Annual taxes ÷ 12
   - Homeowners Insurance: Annual premium ÷ 12
   - HOA Fees (if applicable): Monthly amount
   - PMI (if LTV > 80%): Use PMI rate table

**Example:**
\`\`\`
Loan Amount: $450,000 at 6.5% for 30 years
P&I: $2,844.08
Property Taxes: $500/month ($6,000 annual)
Insurance: $150/month ($1,800 annual)
HOA: $200/month
Total PITI: $3,694.08

Gross Monthly Income: $7,916.67 ($95,000 annual)
Front-End DTI: ($3,694.08 ÷ $7,916.67) × 100 = 46.7%
\`\`\`

#### 5.1.2 Back-End DTI (Total Debt Ratio)
**Formula:** (Total Monthly Debt Obligations ÷ Gross Monthly Income) × 100

**Step-by-Step Calculation:**
1. Sum ALL monthly debt obligations:
   - Housing payment (PITI)
   - Auto loans
   - Student loans
   - Credit card minimum payments
   - Other loans
   - Child support/alimony

2. Special Calculations:
   - **Credit Cards:** Use greater of: actual payment or 2% of balance
   - **Student Loans:** Use actual payment or 0.5% of balance if deferred
   - **Installment Loans:** Use actual monthly payment
   - **Revolving Debt:** Use minimum payment shown on credit report

**Example:**
\`\`\`
Total PITI: $3,694.08
Auto Loan: $450
Student Loan: $350
Credit Cards (min): $200
Total Monthly Debt: $4,694.08

Back-End DTI: ($4,694.08 ÷ $7,916.67) × 100 = 59.3%
\`\`\`

### 5.2 Loan-to-Value (LTV) Ratio Calculation

**Formula:** (Loan Amount ÷ Property Value) × 100

**Instructions:**
1. Determine property value:
   - Purchase: Use LESSER of purchase price or appraised value
   - Refinance: Use current appraised value
   
2. Calculate for all liens:
   - First Mortgage LTV: First mortgage ÷ Property value
   - Combined LTV (CLTV): All mortgages ÷ Property value

**Example:**
\`\`\`
Property Value: $500,000 (appraised)
First Mortgage: $450,000
LTV: ($450,000 ÷ $500,000) × 100 = 90%

If Second Mortgage: $25,000
CLTV: ($475,000 ÷ $500,000) × 100 = 95%
\`\`\`

### 5.3 Income Calculation Guidelines

#### 5.3.1 W-2 Employee Income
**Base Salary:**
1. Obtain 2 most recent pay stubs
2. Verify YTD earnings match frequency
3. Calculate: (YTD Earnings ÷ Months Worked) × 12
4. Compare to prior 2 years W-2s
5. Use LOWER of current run rate or 2-year average

**Overtime/Bonus:**
- Requires 2-year history
- Calculate 2-year average
- If declining, use lower amount or exclude
- Must be likely to continue

**Commission:**
- Requires 2-year history
- If >25% of income, treat as self-employed
- Use 2-year average (or less if declining)

#### 5.3.2 Self-Employed Income
**Required Documents:**
- 2 years personal tax returns (1040)
- 2 years business tax returns (if applicable)
- YTD P&L and Balance Sheet
- Business bank statements

**Calculation Method:**
1. Start with Schedule C net income (or K-1)
2. Add back:
   - Depreciation
   - Depletion
   - One-time expenses
   - Home office expenses (if buying new home)
3. Subtract:
   - Meals & entertainment
   - Business use of vehicle (if also claimed personally)
4. Average over 2 years
5. If declining >20%, use current year only

### 5.4 Asset Calculation and Verification

#### 5.4.1 Liquid Assets
**Acceptable Sources:**
- Checking/Savings accounts
- Money Market accounts
- CDs (without penalty)
- Stocks/Bonds (70% of value)
- Retirement accounts (60% of vested balance if <59.5 years)

**Large Deposit Definition:** 
- >50% of monthly income = requires explanation
- >$5,000 = automatic review trigger

#### 5.4.2 Required Reserves Calculation
**Formula:** Number of months × PITI payment

**Requirements by Property Type:**
- Primary Residence: 2 months (0 if LTV <80%)
- Second Home: 4 months
- Investment Property: 6 months
- Multiple Properties: Add 2 months per additional

## 6. LOAN DECISIONING CRITERIA

### 6.1 Automatic Approval Criteria
Applications meeting ALL of the following criteria qualify for streamlined approval:
- Credit Score ≥ 740
- DTI Ratio ≤ 36%
- LTV Ratio ≤ 80%
- Employment History ≥ 2 years (same employer or industry)
- No bankruptcies, foreclosures, or collections in past 7 years
- Loan Purpose: Purchase or rate/term refinance
- Verified assets ≥ 120% of required

### 6.2 Standard Review Criteria

#### 6.2.1 Credit Score Requirements
| Loan Type | Minimum Score | LTV Limit | Additional Requirements |
|-----------|---------------|-----------|------------------------|
| Conventional | 620 | 95% | DTI ≤ 45% |
| Jumbo | 700 | 80% | 6 months reserves |
| Investment Property | 680 | 75% | 12 months reserves |

#### 6.2.2 Income and Employment Standards
- **Minimum Employment History:** 2 years in same field
- **Income Calculation:**
  - W-2 Employees: 2-year average
  - Self-Employed: 2-year average of tax returns
  - Commission/Bonus: 2-year history required, conservative averaging
- **Income Stability:** No gaps > 30 days in past 24 months

#### 6.2.3 Debt-to-Income Ratio Thresholds
- **Front-End Ratio (Housing Only):** Maximum 28%
- **Back-End Ratio (Total Debt):** Maximum 43%
- **Exception Allowed:** Up to 50% with compensating factors

### 6.3 Denial Criteria
Applications must be denied if ANY of the following apply:
- Credit Score < 580
- DTI Ratio > 50% (regardless of compensating factors)
- Bankruptcy discharge < 2 years
- Foreclosure < 3 years
- Unable to verify income or employment
- Insufficient funds for down payment and closing costs
- Property fails to meet minimum standards

## 7. STEP-BY-STEP DECISION PROCESS

### Step 1: Initial Document Review (5-10 minutes)

**Required Actions:**
1. **Open loan file in system**
   - Verify loan number matches application
   - Check for duplicate applications

2. **Document Checklist - Mark each as received:**
   - [ ] Completed 1003 application (all fields complete)
   - [ ] Credit authorization (signed and dated)
   - [ ] Government ID (unexpired)
   - [ ] 2 years W-2s or tax returns
   - [ ] 30 days pay stubs
   - [ ] 2 months bank statements (all pages)
   - [ ] Purchase contract (if purchase)
   - [ ] Appraisal or AVM

3. **Initial Data Entry Verification:**
   - Confirm SSN matches credit report
   - Verify income figures match documentation
   - Check property address is complete

**RED FLAGS requiring immediate escalation:**
- Inconsistent SSN
- Income doesn't match stated
- Missing pages from statements

### Step 2: Credit Analysis (10-15 minutes)

**Detailed Review Process:**

1. **Pull Tri-Merge Credit Report**
   - Use all three bureaus (Experian, Equifax, TransUnion)
   - Use middle score for qualifying
   - If only two scores, use lower

2. **Credit Score Analysis:**
   \`\`\`
   Score Range    Action Required
   740+          Proceed normally
   680-739       Note compensating factors
   620-679       Requires additional review
   <620          Check for errors, likely denial
   \`\`\`

3. **Payment History Review:**
   - Count late payments by category:
     - 30 days late: Minor impact if <3 in 24 months
     - 60 days late: Major impact, require explanation
     - 90+ days late: Significant concern
   - Review collections/charge-offs:
     - Medical collections <$500: May ignore
     - All others: Require explanation

4. **Credit Utilization Calculation:**
   \`\`\`
   Total Credit Card Balances ÷ Total Credit Limits × 100
   
   Example:
   Card 1: $2,000 / $10,000
   Card 2: $3,000 / $8,000
   Card 3: $500 / $5,000
   Total: $5,500 / $23,000 = 23.9% (Good)
   
   Guidelines:
   <30% = Excellent
   30-50% = Acceptable
   >50% = Concern
   >75% = High Risk
   \`\`\`

5. **Document Findings:**
   - Screenshot credit summary page
   - Note all derogatory items
   - Calculate average account age

### Step 3: Income and Employment Verification (15-20 minutes)

**Detailed Verification Steps:**

1. **Employment Verification Phone Call:**
   - Call HR department (not supervisor)
   - Use verbal VOE script:
     \`\`\`
     "This is [Name] from [Bank] calling to verify employment
     for [Applicant] who has applied for a mortgage loan.
     Can you verify:
     - Start date: _______
     - Current position: _______
     - Current salary: $_______
     - Employment status: FT/PT/Contract
     - Likelihood of continued employment: _______"
     \`\`\`
   - Document call details in system

2. **Income Calculation Worksheet:**
   \`\`\`
   Base Income Calculation:
   Latest Pay Stub Gross: $_______ × Pay Frequency = Annual
   Prior Year W-2: $_______
   2 Years Ago W-2: $_______
   
   If variance >10%, use:
   - Increasing: Current rate
   - Decreasing: Lower of current or average
   - Stable: 2-year average
   \`\`\`

3. **YTD Verification:**
   \`\`\`
   YTD Earnings ÷ # of Pay Periods = Average per Period
   Average × Annual Periods = Projected Annual
   
   Compare to stated income - variance must be <10%
   \`\`\`

### Step 4: Collateral Evaluation (10-15 minutes)

**Property Analysis Requirements:**

1. **Appraisal Review Checklist:**
   - [ ] Appraiser license current
   - [ ] Property photos included (min 6)
   - [ ] Comparable sales within 1 mile
   - [ ] Comps within 90 days
   - [ ] No adverse conditions noted
   - [ ] Value supports loan amount

2. **Market Analysis:**
   \`\`\`
   Subject Property: $500,000
   Comp 1: $495,000 (0.25 miles, 2 months)
   Comp 2: $510,000 (0.5 miles, 1 month)
   Comp 3: $498,000 (0.75 miles, 3 months)
   
   Average: $501,000
   Variance from Subject: 0.2% (Acceptable if <5%)
   \`\`\`

3. **Property Eligibility Matrix:**
   | Property Type | Max LTV | Special Requirements |
   |--------------|---------|---------------------|
   | SFR | 95% | None |
   | Condo | 90% | HOA review required |
   | 2-4 Unit | 85% | Rental income analysis |
   | Manufactured | 80% | Must be affixed |

### Step 5: Risk Assessment (10 minutes)

**Risk Scoring Matrix:**

| Factor | Low Risk (1) | Medium Risk (2) | High Risk (3) |
|--------|-------------|-----------------|---------------|
| Credit Score | >720 | 660-719 | <660 |
| DTI | <30% | 30-40% | >40% |
| LTV | <70% | 70-85% | >85% |
| Employment | >5 years | 2-5 years | <2 years |
| Reserves | >12 months | 3-12 months | <3 months |
| Property | Primary | Second Home | Investment |

**Calculation:**
- Sum all scores
- 6-8 = Low Risk
- 9-12 = Medium Risk
- 13-18 = High Risk

### Step 6: Decision Formulation (10-15 minutes)

**Decision Tree Process:**

1. **Check Minimum Requirements:**
   \`\`\`
   Credit Score >= 620? → Yes/No
   DTI <= 50%? → Yes/No
   LTV <= 95%? → Yes/No
   Income Verified? → Yes/No
   
   If ANY "No" → DENY
   \`\`\`

2. **Apply Compensating Factors:**
   - Strong factors (can offset 1 weakness):
     - Assets > 20% of loan amount
     - Credit score > 780
     - LTV < 60%
   - Moderate factors (2 required to offset 1 weakness):
     - Stable employment > 10 years
     - No debt besides mortgage
     - Cash reserves > 12 months

3. **Determine Final Decision:**
   - All criteria met → APPROVE
   - 1-2 criteria missed but offset → CONDITIONAL
   - Multiple criteria missed → DENY

### Step 7: Documentation of Decision (10-15 minutes)

**Required Decision Narrative Template:**

\`\`\`
LOAN DECISION NARRATIVE
Date: [Date]
Loan Officer: [Name]
Application #: [Number]

APPLICANT SUMMARY:
- Name: [Applicant Name]
- Loan Amount: $[Amount]
- Property Value: $[Value]
- Loan Purpose: [Purpose]

CREDIT ANALYSIS:
- Middle Credit Score: [Score]
- Payment History: [Summary]
- Total Accounts: [#]
- Oldest Account: [Years]
- Recent Inquiries: [#]
[Detailed explanation of any derogatory credit]

CAPACITY ANALYSIS:
- Verified Income: $[Amount]/month
- Front-End DTI: [%]
- Back-End DTI: [%]
- Employment Stability: [Years]
[Income calculation methodology]

COLLATERAL ANALYSIS:
- Appraised Value: $[Amount]
- LTV: [%]
- Property Type: [Type]
- Market Conditions: [Stable/Appreciating/Declining]

CAPITAL ANALYSIS:
- Verified Assets: $[Amount]
- Required Reserves: [Months]
- Down Payment Source: [Source]
- Gift Funds: $[Amount if applicable]

RISK ASSESSMENT:
Overall Risk Level: [Low/Medium/High]
- Primary Risk Factors: [List]
- Mitigating Factors: [List]

DECISION: [APPROVE/CONDITIONAL/DENY]

RATIONALE:
[Detailed explanation of decision based on above factors]

CONDITIONS (if applicable):
1. [Specific condition with clear requirements]
2. [Timeline for satisfaction]
3. [Who is responsible for clearing]

COMPLIANCE CERTIFICATION:
I certify this decision complies with all applicable regulations
and bank policies. No prohibited factors were considered.

Loan Officer Signature: _________________ Date: _______
\`\`\`

## 8. DECISION RATIONALE REQUIREMENTS

### 8.1 Required Elements for ALL Decisions

**Approval Rationale Must Include:**
1. Statement confirming all ratios within guidelines
2. Specific strengths (minimum 3)
3. How risks are mitigated
4. Confirmation of policy compliance

**Example Approval Rationale:**
\`\`\`
"Application approved based on strong credit profile (score 745), 
stable employment (8 years same employer), and conservative 
LTV of 75%. DTI ratios of 25%/35% are well within guidelines. 
Applicant has 12 months reserves post-closing. Property appraisal 
supports value with stable market conditions. All bank policies 
and regulatory requirements satisfied."
\`\`\`

**Conditional Approval Must Include:**
1. Each condition numbered and specific
2. Clear requirements for satisfaction
3. Timeline for completion
4. Impact if not satisfied

**Example Conditional Language:**
\`\`\`
"Conditional approval granted subject to:
1. Updated bank statement showing $50,000 deposit - must provide 
   documentation of source within 5 business days
2. Written explanation for 60-day late payment on auto loan - 
   required before final approval
3. Verification of bonus income continuation - employer letter 
   required within 10 days"
\`\`\`

**Denial Rationale Must Include:**
1. Primary reason with specific policy reference
2. What would need to change for approval
3. Timeframe before reapplication
4. Fair lending statement

**Example Denial Rationale:**
\`\`\`
"Application denied due to excessive DTI ratio of 55% which 
exceeds maximum allowable 50% per Policy 3.2.1. Additionally, 
credit score of 590 is below minimum 620 requirement. Applicant 
may reapply after 6 months with improved credit score and/or 
reduced debt obligations. This decision was based solely on 
creditworthiness factors."
\`\`\`

## 9. QUALITY CONTROL

### 9.1 Self-Review Checklist (Before Submission)
- [ ] All calculations double-checked
- [ ] All required documents in file
- [ ] Credit report < 90 days old
- [ ] Income calculations documented
- [ ] Appraisal review complete
- [ ] Decision narrative complete
- [ ] Conditions clear and specific
- [ ] File notes comprehensive

### 9.2 Common Errors to Avoid
1. **Calculation Errors:**
   - Using gross vs net income incorrectly
   - Missing recurring debts
   - Wrong payment calculation

2. **Documentation Errors:**
   - Missing pages from statements
   - Expired documents
   - Unsigned forms

3. **Decision Errors:**
   - Vague conditions
   - Missing rationale elements
   - Incorrect risk assessment

## 10. COMPLIANCE REQUIREMENTS

### 10.1 Regulatory Compliance
- Equal Credit Opportunity Act (ECOA)
- Fair Housing Act
- Truth in Lending Act (TILA)
- Real Estate Settlement Procedures Act (RESPA)
- Home Mortgage Disclosure Act (HMDA)

### 10.2 Fair Lending Considerations
- Decisions based solely on creditworthiness
- Consistent application of criteria
- No prohibited basis considerations
- Regular fair lending testing and monitoring

### 10.3 Red Flags Requiring Immediate Escalation
- Suspected fraud or misrepresentation
- Pressure from third parties
- Unusual payment arrangements
- Identity verification issues
- Significant undisclosed debts discovered

## 11. ESCALATION PROCEDURES

### 11.1 When to Escalate
- Application falls outside standard guidelines
- Compensating factors require evaluation
- Complex income calculations
- Property issues requiring expertise
- Customer complaints or special circumstances

### 11.2 Escalation Path
1. Senior Loan Officer
2. Underwriting Manager
3. Chief Credit Officer
4. Credit Committee (loans > $1M)

## 12. TRAINING REQUIREMENTS

All personnel must complete:
- Initial SOP training (16 hours)
- Annual refresher training (4 hours)
- Regulatory update training (as needed)
- System training for new implementations

## 13. PERFORMANCE METRICS

### 13.1 Key Performance Indicators
- Decision accuracy rate: Target 98%
- Processing time: Target 48-72 hours
- Condition clearing rate: Target 85% within 10 days
- Quality control pass rate: Target 95%

### 13.2 Individual Metrics
- Decisions per day
- Error rate
- Customer satisfaction scores
- Compliance violations

## 14. APPENDICES

### Appendix A: Quick Reference Decision Matrix
### Appendix B: Income Calculation Worksheets
### Appendix C: Required Documentation Checklist
### Appendix D: Condition Templates
### Appendix E: Adverse Action Notice Templates

---

**Document Control:**
- Review Frequency: Quarterly
- Next Review Date: [Date]
- Distribution: All Credit Department Personnel
- Confidentiality: Internal Use Only

**Revision History:**
| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | [Date] | Initial Release | [Name] |
| 2.0 | [Date] | Updated risk criteria | [Name] |`;

export default function App() {
  const [loanDecision, setLoanDecision] = useState<LoanDecision | null>(null);
  const [qaSessionStarted, setQASessionStarted] = useState(false);
  const [qaSessionCompleted, setQASessionCompleted] = useState(false);
  const [showQualityCoach, setShowQualityCoach] = useState(false);
  const [sopOpen, setSopOpen] = useState(false);

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
              <>
                {/* SOP Button */}
                <div className="mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSopOpen(!sopOpen)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Standard Operating Procedure</span>
                      </div>
                      {sopOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </Button>
                  
                  {sopOpen && (
                    <div className="mt-4">
                      <div className="border rounded-xl">
                        <div className="bg-background rounded-xl">
                          <div className="h-[600px] w-full overflow-y-auto">
                            <div className="p-8">
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                                {SOP_CONTENT}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Placeholder Card */}
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
              </>
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