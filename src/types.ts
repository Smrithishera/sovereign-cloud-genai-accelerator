/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EnterprisePreset {
  id: string;
  name: string;
  country: "DE" | "CH" | "AT";
  industry: string;
  complianceLevel: "Maximum Sovereign" | "Hybrid Sovereign" | "EU Grounded Only";
  regionalGrounding: string;
  sampleData: string;
  mcpConnectors: string[];
  gdprStrictness: "Strict" | "Ultra-Isolated" | "Standard";
}

export interface TelemetryMetrics {
  throughput: number; // tokens/second
  modelUsed: string;
  latencyMs: number;
  tokensProcessed: number;
  frankfurtNodeStatus: {
    availableTpuUnits: number;
    tpuUtilization: number;
    tokensPerMinuteRemaining: number;
    concurrentRequestsBudget: number;
  };
  mcpConnectors: {
    id: string;
    name: string;
    protocol: string;
    status: "Active" | "Standby" | "Routing";
    tools: string[];
  }[];
}

export interface TracingStep {
  id: string;
  nodeName: string;
  status: "pending" | "running" | "completed" | "warning";
  timestamp: string;
  durationMs: number;
  logMessage: string;
}

export interface AnalysisResponse {
  scrubbedText: string;
  gdprScrubbedItems: string[];
  routingDecision: string;
  selectedModel: string;
  evaluationScores: {
    sovereignty: number;
    regulatoryAdherence: number;
    hallucinationIndex: number; // lower or higher based on scoring
  };
  agentLogs: TracingStep[];
  latencyMs: number;
  throughputTps: number;
}

export interface CodeBlueprint {
  id: string;
  title: string;
  category: "LangGraph" | "Model Context Protocol" | "Terraform" | "Evaluation Pipeline";
  description: string;
  language: "typescript" | "python" | "hcl";
  code: string;
}

export interface FDEQualification {
  id: string;
  title: string;
  recruiterKeyword: string;
  description: string;
  demonstrationContext: string;
  relatedFeatureId: string; // triggers visual trace/sandbox parameters
  detailedRequirements: string[];
}
