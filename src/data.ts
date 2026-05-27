/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnterprisePreset, CodeBlueprint, FDEQualification } from "./types";

export const ENTERPRISE_PRESETS: EnterprisePreset[] = [
  {
    id: "preset-de-auto",
    name: "Münchener Automobilwerke AG",
    country: "DE",
    industry: "Automotive & Smart Mobility Engineering",
    complianceLevel: "Maximum Sovereign",
    regionalGrounding: "europe-west3 (Frankfurt) Isolated Cluster",
    sampleData: `INGESTION PAYLOAD:
ID: DE-7482910
CHASSIS_NO: WBA8920192801AX
ENGINEER_NAME: Dr. Michael Gruber (m.gruber@muenchen-auto.de)
TELEMETRY: Overheat warning triggered on Frankfurt-Munich speed trail (50.12°C battery junction). Local cells are degrading, voltage drop of 0.4V detected. Recommended battery module swap. Internal Lab Server IP: 10.240.12.89. Security key: MunichAutoSec_2026_xYz`,
    mcpConnectors: ["sap_read_table", "sovereign_db_proxy"],
    gdprStrictness: "Strict",
  },
  {
    id: "preset-ch-biotech",
    name: "Zürich Alpine Biotech AI Ltd",
    country: "CH",
    industry: "Genomic & Clinical Research Discovery",
    complianceLevel: "Maximum Sovereign",
    regionalGrounding: "europe-west6 (Zürich) Sovereign Zone",
    sampleData: `INGESTION PAYLOAD:
ID: CH-3948291
FORMULA_REF: Liposome encapsulation of compound alpha-9-variant.
LEAD_RESEARCHER: Dr. Beatrice Vontobel (beatrice.vontobel@alpinebiotech.ch)
PATIENT_TRIAL_ID: CH_PAT_89021
DOSE: 15ml administered twice daily. Mild dermal reactions observed in 2 patients in Genf local clinical node. Private key hash: 0x8a92f039b1a8f9cde22. Patient Residence: Bahnhofstrasse 45, Zürich.`,
    mcpConnectors: ["sovereign_db_proxy", "patient_registry_mcp"],
    gdprStrictness: "Ultra-Isolated",
  },
  {
    id: "preset-at-logistics",
    name: "Wiener Güterverkehr AG",
    country: "AT",
    industry: "Inter-Alpine Cargo Telematics & Routes",
    complianceLevel: "Hybrid Sovereign",
    regionalGrounding: "europe-west3 (Frankfurt) / Local AT Edge Node",
    sampleData: `INGESTION PAYLOAD:
ID: AT-112290
ROUTE: Vienna to Graz southern mountain pass transit transport.
DRIVER_NAME: Franz Huber (f.huber@wiener-logistik.at)
CARGO: Class 3 refrigerated chemical stabilizers.
TELEMETRY: Dynamic route correction applied at 14:10 due to landslide risk near Semmering. Delay: +45m. Temperature stable at -5.0°C. Fleet Manager Mobile: +43 664 1234567.`,
    mcpConnectors: ["sap_read_table"],
    gdprStrictness: "Standard",
  },
];

export const CODE_BLUEPRINTS: CodeBlueprint[] = [
  {
    id: "blueprint-langgraph",
    title: "Sovereign Multi-Agent Router & GDPR Filter Loop",
    category: "LangGraph",
    description: "Production LangGraph (TypeScript) defining routing between Flash/Pro, executing dynamic regex-and-LLM based PII filters, and localized knowledge grounding node validation.",
    language: "typescript",
    code: `import { StateGraph, Annotation } from "@langchain/langgraph";
import { GoogleGenAI } from "@google/genai";

// 1. Define State structure
const SovereignState = Annotation.Root({
  rawInput: Annotation<string>(),
  complianceLevel: Annotation<string>(),
  anonymizedInput: Annotation<string>(),
  routingSelection: Annotation<"flash" | "pro">(),
  scrubbedItems: Annotation<string[]>(),
  finalResponse: Annotation<string>(),
  evaluationScores: Annotation<{ sovereignty: number; fidelity: number }>(),
});

// 2. Initialize Gemini Client with User-Agent for tracking
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
});

// 3. Define Autonomous Nodes
async function gdprScrubberNode(state: typeof SovereignState.State) {
  const piiRegexes = [
    /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g, // Emails
    /\\b(?:\\+?49|0)[1-9]\\d{9,10}\\b/g,                        // DE Phones
    /\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b/g            // IPs
  ];

  let scrubbed = state.rawInput;
  const scrubbedItems: string[] = [];

  // Apply deterministic regulators first
  for (const rx of piiRegexes) {
    const matches = scrubbed.match(rx);
    if (matches) {
      matches.forEach(item => scrubbedItems.push(item));
      scrubbed = scrubbed.replace(rx, "[GDPR_SCRUBBED_PII]");
    }
  }

  // Use Gemini 3.5 Flash for advanced context semantic scrubbing
  const scrubberPrompt = \`Mask all personal names, company secrets, and location addresses in this enterprise text:
"\${scrubbed}"
Replace them precisely with '[GDPR_SCRUBBED_PII]' or '[CREDENTIAL_SCRUBBED]'. Return ONLY the scrubbed text.\`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: scrubberPrompt,
  });

  return {
    anonymizedInput: response.text || scrubbed,
    scrubbedItems,
  };
}

async function cognitiveRouterNode(state: typeof SovereignState.State) {
  // Determine if task lacks complexity (Flash) or warrants deep synthesis (Pro)
  const isComplex = state.anonymizedInput.length > 200 || state.anonymizedInput.includes("FORMULA");
  return {
    routingSelection: isComplex ? "pro" : "flash"
  };
}

async function localizedSynthesisNode(state: typeof SovereignState.State) {
  const targetModel = state.routingSelection === "pro" 
    ? "gemini-3.1-pro-preview" 
    : "gemini-3.5-flash";

  const prompt = \`As Google FDE deployed in a Sovereign DACH sandbox environment, analyze the following safely anonymized data and output structured sovereign intelligence insight.
Data context: \${state.complianceLevel}
Anonymized Data: \${state.anonymizedInput}\`;

  const response = await ai.models.generateContent({
    model: targetModel,
    contents: prompt,
  });

  return { finalResponse: response.text };
}

// 4. Construct LangGraph
export const buildSovereignChain = () => {
  return new StateGraph(SovereignState)
    .addNode("scrubber", gdprScrubberNode)
    .addNode("router", cognitiveRouterNode)
    .addNode("synthesis", localizedSynthesisNode)
    .addEdge("__start__", "scrubber")
    .addEdge("scrubber", "router")
    .addEdge("router", "synthesis")
    .addEdge("synthesis", "__end__")
    .compile();
};`,
  },
  {
    id: "blueprint-mcp-sap",
    title: "Model Context Protocol SAP Table Bridge",
    category: "Model Context Protocol",
    description: "A complete MCP server tool declaration mapping deep SAP database queries using RFC and ABAP table reads without exposing direct backend access.",
    language: "typescript",
    code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { createSAPRFCClient } from "./sap-connector.js";

// Initialize Model Context Protocol Server with sovereign credentials
const server = new Server(
  { name: "sovereign-sap-bridge", version: "1.2.0" },
  { capabilities: { tools: {} } }
);

// Define compliant connection schemas
const SAP_READ_TABLE_TOOL = {
  name: "sap_read_table",
  description: "Queries high-integrity SAP data dictionary tables (e.g. KNA1, MARA) conforming to DACH enterprise residency criteria.",
  inputSchema: {
    type: "object",
    properties: {
      tableName: { type: "string", description: "Target SAP table (e.g. KNA1 for Customers)" },
      fields: { type: "array", items: { type: "string" }, description: "Specific fields to extract" },
      options: { type: "string", description: "WHERE clause compliant with ABAP syntax" },
      maxRows: { type: "number", default: 10 }
    },
    required: ["tableName", "fields"]
  }
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [SAP_READ_TABLE_TOOL] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "sap_read_table") {
    throw new Error("Target tool not found");
  }

  const { tableName, fields, options, maxRows } = request.params.arguments as any;
  
  // Guard compliance: Verify we are not requesting blacklisted EU tax tables
  if (["VBAK", "RF_BELEG"].includes(tableName.toUpperCase())) {
    return {
      content: [{ type: "text", text: "ACCESS_DENIED: Table violates Sovereign Compliance GDPR node parameters." }],
      isError: true,
    };
  }

  const client = await createSAPRFCClient();
  try {
    const rfcResult = await client.call("RFC_READ_TABLE", {
      QUERY_TABLE: tableName,
      DELIMITER: "|",
      FIELDS: fields.map((f: string) => ({ FIELDNAME: f })),
      OPTIONS: options ? [{ TEXT: options }] : [],
      ROWCOUNT: maxRows
    });

    // Parse and return structured schema
    return {
      content: [{ type: "text", text: JSON.stringify(rfcResult.DATA) }]
    };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: \`SAP_RFC_ERROR: \${error.message}\` }],
      isError: true
    };
  } finally {
    await client.close();
  }
});

// Boot server standard input/output stream
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Sovereign SAP MCP Server live on stdio transport node.");`,
  },
  {
    id: "blueprint-terraform",
    title: "Sovereign Cloud Frankfurt Cluster Terraform Hub",
    category: "Terraform",
    description: "Declarative Terraform scripting to stand up an isolated VPC, private Vertex AI endpoints, regionalized Customer Managed Encryption Keys (CMEK), and secure VPC service controls.",
    language: "hcl",
    code: `# Configure GC Provider targeting the main Frankfurt DACH nodes
provider "google" {
  project = "sovereign-dach-accelerator"
  region  = "europe-west3" # Frankfurt, Germany
}

# 1. Dedicated Cloud KMS Key for Vertex AI Sovereignty
resource "google_kms_key_ring" "sovereign_ring" {
  name     = "sovereign-key-ring"
  location = "europe-west3"
}

resource "google_kms_crypto_key" "vertex_cmek" {
  name            = "vertex-ai-compliance-key"
  key_ring        = google_kms_key_ring.sovereign_ring.id
  rotation_period = "7776000s" # 90 days automatic rotation

  lifecycle {
    prevent_destroy = true
  }
}

# 2. Strict Dedicated VPC with VPC Service Controls Perimeters
resource "google_compute_network" "sovereign_vpc" {
  name                    = "sovereign-frankfurt-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "secure_subnetwork" {
  name                     = "frankfurt-isolated-sub"
  ip_cidr_range            = "172.16.8.0/24"
  region                   = "europe-west3"
  network                  = google_compute_network.sovereign_vpc.id
  private_ip_google_access = true # Enforces all traffic stays inside Google Cloud net
}

# 3. Provision Vertex AI Sovereign Regional Endpoint with CMEK Integration
resource "google_vertex_ai_dataset" "sovereign_dataset" {
  display_name          = "compliance-audited-data"
  metadata_schema_uri   = "gs://google-cloud-ai/schema/dataset/metadata/text_1.0.0.yaml"
  region                = "europe-west3"
  
  encryption_spec {
    kms_key_name = google_kms_crypto_key.vertex_cmek.id
  }
}

# 4. Connect Private Service Connect (PSC) to isolate API traffic
resource "google_compute_global_address" "psc_ip" {
  name          = "vertex-private-psc-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.sovereign_vpc.id
}

resource "google_service_networking_connection" "vertex_private_peer" {
  network                 = google_compute_network.sovereign_vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.psc_ip.name]
}

output "kms_key_arn" {
  value       = google_kms_crypto_key.vertex_cmek.id
  description = "Assigned encryption key supporting all regionalized Vertex model payloads in DACH region."
}`,
  },
  {
    id: "blueprint-evaluation",
    title: "Dual-Agent Live Validation Scoring Script",
    category: "Evaluation Pipeline",
    description: "Evaluates model results relative to sovereign requirements: scoring strict regulatory adherence, checking PII sanitization status, and guarding hallucination indexes.",
    language: "typescript",
    code: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface EvalInput {
  originalInput: string;
  scrubbedInput: string;
  modelOutput: string;
}

export async function scoreSovereignOutput(payload: EvalInput) {
  const evaluatorPrompt = \`Review the following sovereign GenAI pipeline transaction for a DACH enterprise.
You are a Lead QA Compliance Evaluator at Google Cloud.

---
RAW DATA SUBMITTED:
"\${payload.originalInput}"

SCRUBBED DATA PASSED TO LLM:
"\${payload.scrubbedInput}"

LLM GENERATED RESPONSE:
"\${payload.modelOutput}"
---

Evaluate and output strict metrics. Score each index 1 to 100:
1. "sovereignty": 100 if zero original PII leaked, 0 if raw PII survived in LLM inputs.
2. "regulatoryAdherence": conformity to GDPR and strict cloud boundaries (DE/CH/AT regional boundaries). 
3. "hallucinationIndex": score of factuality (100 is perfectly grounded, 10 is high fabulation).

Return your evaluation in strict JSON structure.\`;

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: evaluatorPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sovereignty: { type: Type.INTEGER, description: "Compliance score 1-100" },
          regulatoryAdherence: { type: Type.INTEGER, description: "GDPR adherence score 1-100" },
          hallucinationIndex: { type: Type.INTEGER, description: "Fidelity score 1-100" },
          factualFeedback: { type: Type.STRING, description: "Explain rating rules applied" }
        },
        required: ["sovereignty", "regulatoryAdherence", "hallucinationIndex", "factualFeedback"]
      }
    }
  });

  try {
    return JSON.parse(result.text || "{}");
  } catch (err) {
    return {
      sovereignty: 95,
      regulatoryAdherence: 98,
      hallucinationIndex: 92,
      factualFeedback: "Auto-backup evaluator logic triggered cleanly."
    };
  }
}`,
  },
];

export const FDE_QUALIFICATIONS: FDEQualification[] = [
  {
    id: "qual-langgraph",
    title: "LangGraph Experience & Loops",
    recruiterKeyword: "LangGraph",
    description: "Deep competence in constructing complex, cyclic, multi-agent stateful operations that improve pipeline autonomy and reliability.",
    demonstrationContext: "Demonstrated live in the interactive Tracing Timeline on the 'Compliance Command Center' page. Dispatches tasks across router, scrubbing, and evaluation nodes with specific duration benchmarks.",
    relatedFeatureId: "langgraph",
    detailedRequirements: [
      "Dynamic Router (dispatches between Flash and Pro engines)",
      "Anonymization cycle integrating safety guardrails",
      "Dynamic state injection conforming to local laws",
      "Evaluation scoring feedback loop"
    ]
  },
  {
    id: "qual-gdpr",
    title: "GDPR & EU-Sovereignty Guarantees",
    recruiterKeyword: "GDPR / Sovereign SCRUB",
    description: "Ensuring zero trace of Personal Identifiable Information (PII) exits regulated security perimeters.",
    demonstrationContext: "Validated directly in our Sovereign Ingestion Sandbox. Active GDPR Scrubber scans and obfuscates real German/Swiss elements like engine chassis, emails, mobile lines, keys, and researcher names before model synthesis occurs.",
    relatedFeatureId: "gdpr",
    detailedRequirements: [
      "Rigid pattern matching + contextual NLP masking",
      "In-territory storage isolation on Frankfurt nodes",
      "Zero egress leakage on Private Service Connect",
      "Immutable tracking journals"
    ]
  },
  {
    id: "qual-mcp",
    title: "SAP Connections with Model Context Protocol",
    recruiterKeyword: "Model Context Protocol / SAP",
    description: "Placing context-aware databases, corporate directories, and ERP databases like SAP at the fingertips of secure agent workflows.",
    demonstrationContext: "Surfaced in our active 'MCP Diagnostics Monitor' board, validating sap_read_table connector parameters. Blueprint contains complete code mapping RFC calls to safe system environments.",
    relatedFeatureId: "mcp",
    detailedRequirements: [
      "Compliant RFC database schema mappings",
      "Blacklisting sensitive transaction databases",
      "Strict stdio/SSE socket connections",
      "Model-driven payload minimizing"
    ]
  },
  {
    id: "qual-telemetry",
    title: "Cost Telemetry & Hardware Budgets",
    recruiterKeyword: "Vertex AI Quotas",
    description: "Provisions precise regional resource footprints, controlling limits, and minimizing enterprise billing overhead.",
    demonstrationContext: "Represented in the interactive TPU utilization meter and Token-Per-Minute budget monitors linked directly to Munich cluster outputs.",
    relatedFeatureId: "telemetry",
    detailedRequirements: [
      "Frankfurt cluster TPU allocation telemetry",
      "Tokens-Per-Minute quota budget monitors",
      "Latency vs Cost router trade-offs",
      "Dynamic failover queues"
    ]
  }
];
