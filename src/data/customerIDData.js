// Hard-coded Miro customer data for Customer ID view
export const customerIDData = {
  pricingModel: "Above D7 Freemium SaaS",
  
  conversionRates: [
    { 
      fromStepId: "b7f210ac-5893-42c3-89ef-f6e7f9c81dc8", // Landing Page
      toStepId: "a2d77a9b-2615-4c45-9a47-0f8d52dc7b77", // Signup Page
      fromStepName: "Landing Page - Miro Home",
      toStepName: "Signup Page",
      rate: 90
    },
    { 
      fromStepId: "94c8c557-7a3e-4e85-bf5a-4a3a8ab6a5a7", // Team Setup
      toStepId: "88a49dc2-3f5b-4d0c-8a3f-4de8e9274b4f", // Onboarding Questionnaire
      fromStepName: "Team Setup Page",
      toStepName: "Onboarding Questionnaire",
      rate: 40
    },
    { 
      fromStepId: "cda1e8fb-4f28-4db2-b8e3-7d03fbb4e4cc", // Checkout
      toStepId: "d5c4183b-8a89-4b8a-a9de-943a10d20ed1", // Confirmation
      fromStepName: "Checkout Page",
      toStepName: "Confirmation Page",
      rate: 5
    }
  ],

  stepCPAs: [
    {
      stepId: "88a49dc2-3f5b-4d0c-8a3f-4de8e9274b4f", // Onboarding Questionnaire
      stepName: "Onboarding Questionnaire",
      cpa: 8
    },
    {
      stepId: "d5c4183b-8a89-4b8a-a9de-943a10d20ed1", // Confirmation Page
      stepName: "Confirmation Page",
      cpa: 30
    }
  ],
  
  adSpend: {
    monthly: [
      { id: "google-ads", channel: "Google Ads", amount: 1200000, type: "Non-branded" },
      { id: "meta", channel: "Meta", amount: 450000, type: "Web" },
      { id: "youtube", channel: "YouTube", amount: 40000, type: "Video" }
    ]
  },
  
  featureImportance: [
    { 
      name: "EXTRA_PARAMS_COHORT_EVENT_CUSTOM_AMOUNT_MAX", 
      shapValue: 2.5, 
      featureValue: 0.8,
      impact: "positive"
    },
    { 
      name: "FEATURE_ACTIVITY_COUNT_PER_ACTIVITY_WHERE_ACTIVITY_EQ_QUALIFIED_BANK_CONNECTION_GOOD_CURRENT_BALANCE_AND_INCOME", 
      shapValue: 1.8, 
      featureValue: 0.6,
      impact: "positive"
    },
    { 
      name: "ZIP_LIFE_EXPECTANCY", 
      shapValue: -1.2, 
      featureValue: 0.4,
      impact: "negative"
    },
    { 
      name: "SESSION_AVG_LAG_SECONDS_BETWEEN_SESSIONS", 
      shapValue: 0.9, 
      featureValue: 0.5,
      impact: "positive"
    },
    { 
      name: "TIME_TRIGGER_WEEKLY_COS", 
      shapValue: 1.5, 
      featureValue: 0.7,
      impact: "positive"
    },
    { 
      name: "ZIP_AGE85PLUS_FEM", 
      shapValue: -0.8, 
      featureValue: 0.3,
      impact: "negative"
    },
    { 
      name: "ENTITY_DEVICE_OPERATING_SYSTEM_VERSION", 
      shapValue: 0.6, 
      featureValue: 0.5,
      impact: "positive"
    },
    { 
      name: "ZIP_N_2020_VOTE_PERCENT_GREEN", 
      shapValue: 0.4, 
      featureValue: 0.6,
      impact: "positive"
    },
    { 
      name: "USER_SIGNUP_CHANNEL_TYPE", 
      shapValue: 1.2, 
      featureValue: 0.8,
      impact: "positive"
    },
    { 
      name: "ONBOARDING_COMPLETION_TIME_SECONDS", 
      shapValue: -0.5, 
      featureValue: 0.4,
      impact: "negative"
    },
    { 
      name: "FIRST_BOARD_CREATION_DELAY_HOURS", 
      shapValue: -1.1, 
      featureValue: 0.3,
      impact: "negative"
    },
    { 
      name: "TEAM_SIZE_AT_SIGNUP", 
      shapValue: 1.4, 
      featureValue: 0.7,
      impact: "positive"
    },
    { 
      name: "INVITE_COLLABORATORS_COUNT", 
      shapValue: 1.0, 
      featureValue: 0.6,
      impact: "positive"
    },
    { 
      name: "TEMPLATE_USAGE_FREQUENCY", 
      shapValue: 0.8, 
      featureValue: 0.5,
      impact: "positive"
    },
    { 
      name: "INTEGRATION_CONNECTIONS_COUNT", 
      shapValue: 1.3, 
      featureValue: 0.7,
      impact: "positive"
    }
  ]
};

