/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  Activity,
  Cpu,
  Database,
  Code,
  Award,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Terminal,
  ArrowRight,
  Globe,
  Lock,
  ChevronRight,
  Eye,
  Server,
  Layers,
  HelpCircle
} from "lucide-react";
import { EnterprisePreset, CodeBlueprint, FDEQualification, AnalysisResponse, TracingStep } from "./types";
import { ENTERPRISE_PRESETS, CODE_BLUEPRINTS, FDE_QUALIFICATIONS } from "./data";

export default function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<"sandbox" | "blueprints" | "matrix">("sandbox");

  // Ingestion Sandbox States
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset-de-auto");
  const [customInput, setCustomInput] = useState<string>("");
  const [gdprEnabled, setGdprEnabled] = useState<boolean>(true);
  const [sovereigntyLevel, setSovereigntyLevel] = useState<string>("Maximum Sovereign");
  const [regionalGrounding, setRegionalGrounding] = useState<string>("europe-west3 (Frankfurt) Isolated Cluster");
  const [engineProfile, setEngineProfile] = useState<"flash" | "pro">("flash");

  // Dynamic simulation telemetry states (increase during processing!)
  const [tpuUtilization, setTpuUtilization] = useState<number>(14);
  const [remainingTpm, setRemainingTpm] = useState<number>(4120000);
  const [monthlySpend, setMonthlySpend] = useState<number>(142.50);

  // Analysis result states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTabDetails, setActiveTabDetails] = useState<string>("raw"); // raw or scrubbed outputs view

  // Blueprint copy helper state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedBlueprintCategory, setSelectedBlueprintCategory] = useState<string>("LangGraph");

  // Matrix highlight triggers
  const [matrixHighlightedId, setMatrixHighlightedId] = useState<string | null>(null);

  // Sync state values on Preset selection
  useEffect(() => {
    const selectedPreset = ENTERPRISE_PRESETS.find(p => p.id === selectedPresetId);
    if (selectedPreset) {
      setCustomInput(selectedPreset.sampleData);
      setRegionalGrounding(selectedPreset.regionalGrounding);
      
      // Automatic sovereign compliance defaults
      if (selectedPreset.country === "CH") {
        setSovereigntyLevel("Maximum Sovereign");
        setGdprEnabled(true);
        setEngineProfile("pro"); // Biotech requires reasoning depth by default
      } else if (selectedPreset.country === "DE") {
        setSovereigntyLevel("Maximum Sovereign");
        setGdprEnabled(true);
        setEngineProfile("flash");
      } else {
        setSovereigntyLevel("Hybrid Sovereign");
        setGdprEnabled(true);
        setEngineProfile("flash");
      }
    }
  }, [selectedPresetId]);

  // Handle Trigger Analysis POST Call
  const triggerSovereignIngestion = async () => {
    setIsProcessing(true);
    setAnalysisResult(null);

    // Boost telemetry visuals to simulate deep cloud ingestion loop
    setTpuUtilization(85);
    setRemainingTpm(prev => Math.max(0, prev - Math.floor(1800 + Math.random() * 500)));
    setMonthlySpend(prev => prev + (engineProfile === "pro" ? 0.08 : 0.01));

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: customInput,
          gdprEnabled: gdprEnabled,
          complianceLevel: sovereigntyLevel,
          regionalGrounding: regionalGrounding
        })
      });

      if (!response.ok) {
        throw new Error("Sovereign analytical pipeline rejected ingestion authorization.");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);

      // Flash real-time metrics back down to nominal values
      setTimeout(() => {
        setTpuUtilization(22);
      }, 500);

    } catch (error: any) {
      console.error(error);
      setToastMessage(`ERR_PIPELINE: ${error.message}`);
      setTpuUtilization(12);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyBlueprintCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setToastMessage("Blueprint code copied to secure clipboard.");
    setTimeout(() => {
      setCopiedId(null);
      setToastMessage(null);
    }, 2500);
  };

  const selectPresetCard = (id: string) => {
    setSelectedPresetId(id);
    setAnalysisResult(null);
  };

  // Helper component to display score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/5";
    if (score >= 70) return "text-amber-400 border-amber-500/30 bg-amber-500/5";
    return "text-rose-400 border-rose-500/30 bg-rose-500/5";
  };

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Alert Frame */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 shadow-xl shadow-black/80 font-mono"
            id="toast-notification"
          >
            <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern High-Trust Sovereign Header */}
      <header className="border-b border-slate-800 bg-[#090d1a]/80 backdrop-blur-md sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-inner">
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs tracking-widest font-mono text-emerald-400 font-semibold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DACH GenAI Sovereignty
                </span>
                <span className="text-xs tracking-widest font-mono text-cyan-400 font-semibold uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Google Cloud FDE Portal
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
                Sovereign Cloud GenAI Accelerator
              </h1>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-850">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-400">VPC-SC Zone:</span>
              <span className="text-emerald-400 font-medium font-mono">Isolated</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-850">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Grounding Node:</span>
              <span className="text-cyan-400 font-medium font-mono">europe-west3 (Frankfurt)</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Campaign Pitch Area / FDE Intent Card */}
        <section className="mb-8 p-5 bg-gradient-to-r from-slate-950 via-[#0a0e1c] to-slate-950 border border-slate-800 rounded-xl relative overflow-hidden" id="fde-campaign-card">
          <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-br from-emerald-500/5 to-transparent blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-40 bg-gradient-to-tr from-cyan-500/5 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row gap-5 items-start justify-between relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
                <Award className="w-4 h-4 animate-spin-slow" />
                <span>QUALIFICATIONS DEMONSTRATOR MATRIX</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Forward Deployed Engineer (GenAI, DACH) Campaign
              </h2>
              <p className="text-slate-350 text-sm max-w-3xl leading-relaxed">
                This diagnostic workspace validates real-world technical qualifiers for the FDE role. 
                Utilizing stateful orchestration blueprints, secure Model Context Protocol tool schema configurations, 
                and GDPR-compliant data sanitization filters, this portal exposes live evaluations on sovereign infrastructure hosts in the DACH sector.
              </p>
            </div>
            
            <button
              onClick={() => {
                setActiveTab("matrix");
                setToastMessage("Routed to Experience matrix. Scroll to view qualifiers.");
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-mono font-medium rounded-lg text-amber-400 hover:text-white transition flex items-center gap-2 group shrink-0"
              id="fde-matrix-quicklink"
            >
              <span>Explore FDE Qualifications Map</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Global Navigation Tabs Bar */}
        <div className="flex border-b border-slate-800 mb-8 overflow-x-auto" id="navigation-tabs">
          <button
            onClick={() => setActiveTab("sandbox")}
            className={`px-5 py-3 text-sm font-mono font-medium border-b-2 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${
              activeTab === "sandbox"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
            id="tab-sandbox-btn"
          >
            <Activity className="w-4 h-4" />
            <span>Sovereign Ingestion Sandbox</span>
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
              LIVE
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("blueprints")}
            className={`px-5 py-3 text-sm font-mono font-medium border-b-2 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${
              activeTab === "blueprints"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
            id="tab-blueprints-btn"
          >
            <Code className="w-4 h-4" />
            <span>Production Code Blueprints</span>
            <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded font-mono font-bold">
              4 FILES
            </span>
          </button>

          <button
            onClick={() => setActiveTab("matrix")}
            className={`px-5 py-3 text-sm font-mono font-medium border-b-2 flex items-center gap-2 cursor-pointer transition whitespace-nowrap ${
              activeTab === "matrix"
                ? "border-amber-500 text-amber-400 bg-amber-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
            id="tab-matrix-btn"
          >
            <Award className="w-4 h-4" />
            <span>Google Cloud FDE Experience Map</span>
          </button>
        </div>

        {/* Interactive Tab Containers */}
        <div>
          {/* 1. SOVEREIGN INGESTION SANDBOX */}
          {activeTab === "sandbox" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sandbox-container">
              
              {/* Left Sandbox Gating Settings Panel */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Section A: Selection of DACH Enterprise Targets */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono font-bold tracking-tight text-slate-300 uppercase flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>DACH Enterprise Presets</span>
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">Select one to ingest</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5" id="preset-selector">
                    {ENTERPRISE_PRESETS.map((p) => {
                      const isSelected = p.id === selectedPresetId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => selectPresetCard(p.id)}
                          className={`p-3.5 rounded-lg border text-left transition cursor-pointer relative ${
                            isSelected
                              ? "bg-slate-850/90 border-emerald-500/60 shadow-md shadow-emerald-500/5"
                              : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40"
                          }`}
                          id={`preset-card-${p.id}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                  p.country === "DE" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                  p.country === "CH" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                  "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {p.country}
                                </span>
                                <h4 className="text-xs font-bold text-white">{p.name}</h4>
                              </div>
                              <p className="text-[11px] text-slate-400 font-mono mt-1">{p.industry}</p>
                            </div>
                            
                            {/* Selected Check Ring */}
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-emerald-400 bg-emerald-500/10 text-emerald-400" : "border-slate-700"
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/50 flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-slate-500" />
                              <span>{p.complianceLevel}</span>
                            </span>
                            <span className="font-semibold text-slate-300">
                              {p.gdprStrictness} GDPR
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section B: Adjust Custom Localized Constraints */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-mono font-bold tracking-tight text-slate-300 uppercase flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Localized Isolation Parameters</span>
                  </h3>

                  <div className="space-y-4 text-xs font-mono">
                    
                    {/* GDPR Compliant Node active flag */}
                    <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-lg border border-slate-800">
                      <div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="font-bold text-slate-200">GDPR Compliance Scrubber</span>
                        </div>
                        <p className="text-[10px] text-slate-450 mt-0.5">Scrub clinical/auto secrets from context</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setGdprEnabled(!gdprEnabled);
                          setToastMessage(`GDPR compliance node toggled: ${!gdprEnabled ? "ENABLED" : "DISABLED"}`);
                        }}
                        className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center ${
                          gdprEnabled ? "bg-emerald-500 justify-end" : "bg-slate-700 justify-start"
                        }`}
                        id="gdpr-toggle"
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-md block"></span>
                      </button>
                    </div>

                    {/* Sovereignty Levels Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Sovereignty Isolation Level</span>
                      </label>
                      <select
                        value={sovereigntyLevel}
                        onChange={(e) => {
                          setSovereigntyLevel(e.target.value);
                          setToastMessage(`Isolation changed to: ${e.target.value}`);
                        }}
                        className="w-full bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-slate-200 focus:border-cyan-500 hover:border-slate-750 transition"
                        id="select-sovereignty-level"
                      >
                        <option value="Maximum Sovereign">Maximum Sovereign (Air-Gapped Virtual Subnets)</option>
                        <option value="Hybrid Sovereign">Hybrid Sovereign (Frankfurt Node Gated)</option>
                        <option value="EU Grounded Only">EU Grounded Only (Shared VPC-SC)</option>
                      </select>
                    </div>

                    {/* Regional Grounding Selects */}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span>Frankfurt Cluster Hardware Node</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={regionalGrounding}
                        className="w-full bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg text-slate-400 font-mono text-xs cursor-not-allowed"
                        id="input-grounding-target"
                      />
                    </div>

                    {/* Processing Engine Profiles */}
                    <div className="space-y-1.5">
                      <label className="text-slate-400 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edge Synthesis Model Engine</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setEngineProfile("flash");
                            setToastMessage("Cognitive engine: Gemini 3.5 Flash selected.");
                          }}
                          className={`p-2 rounded-lg border text-center transition font-mono text-[11px] cursor-pointer ${
                            engineProfile === "flash"
                              ? "bg-slate-850 border-emerald-500/60 text-emerald-400 font-bold"
                              : "bg-slate-950 border-slate-850 text-slate-450 hover:bg-slate-900"
                          }`}
                          id="engine-flash-btn"
                        >
                          Gemini 3.5 Flash
                          <span className="block text-[9px] text-slate-500 font-normal">Fast Ingest / 95 tps</span>
                        </button>
                        <button
                          onClick={() => {
                            setEngineProfile("pro");
                            setToastMessage("Cognitive engine: Gemini 3.1 Pro selected.");
                          }}
                          className={`p-2 rounded-lg border text-center transition font-mono text-[11px] cursor-pointer ${
                            engineProfile === "pro"
                              ? "bg-slate-850 border-cyan-500/60 text-cyan-400 font-bold"
                              : "bg-slate-950 border-slate-850 text-slate-450 hover:bg-slate-900"
                          }`}
                          id="engine-pro-btn"
                        >
                          Gemini 3.1 Pro
                          <span className="block text-[9px] text-slate-500 font-normal">Reasoning Heavy</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Right Sandbox Processing Console */}
              <div className="lg:col-span-7 space-y-6">

                {/* Live Multi-Agent Telemetry Grid */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4" id="telemetry-indicators bg-grid">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                    <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span>⚡ Upgraded Multi-Agent Live Telemetry Dashboard</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      NOMINAL STATE
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                    
                    {/* Throughput meter */}
                    <div className="p-3 bg-slate-900/50 border border-slate-850 rounded-lg space-y-1">
                      <div className="text-slate-400 uppercase text-[10px]">Processing Throughput</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-mono text-white animate-pulse">
                          {isProcessing ? "INGESTING..." : (analysisResult ? analysisResult.throughputTps : (engineProfile === "flash" ? 95 : 42))}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">tokens / sec</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full transition-all duration-300 ${engineProfile === "flash" ? "bg-emerald-400" : "bg-cyan-400"}`}
                          style={{ width: engineProfile === "flash" ? "80%" : "40%" }}
                        ></div>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono pt-1">
                        Engine: {engineProfile === "flash" ? "Gemini-3.5-Flash" : "Gemini-3.1-Pro-Preview"}
                      </div>
                    </div>

                    {/* Frankfurt Hardware / Token Quotas */}
                    <div className="p-3 bg-slate-900/50 border border-slate-850 rounded-lg space-y-1">
                      <div className="text-slate-400 uppercase text-[10px]">Vertex AI Frankfurt Quotas</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-white font-bold tracking-tight">
                          {(remainingTpm / 1000000).toFixed(2)}M
                        </span>
                        <span className="text-[10px] text-slate-400">/ 5.0M TPM</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-500"
                          style={{ width: `${(remainingTpm / 5000000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1">
                        <span>TPU Util: {tpuUtilization}%</span>
                        <span className={`${tpuUtilization > 50 ? "text-amber-400 font-bold" : "text-emerald-400"}`}>
                          {tpuUtilization > 50 ? "ACTIVE SYN" : "STABLE"}
                        </span>
                      </div>
                    </div>

                    {/* Sovereign Node cost limits */}
                    <div className="p-3 bg-slate-900/50 border border-slate-850 rounded-lg space-y-1">
                      <div className="text-slate-400 uppercase text-[10px]">Cost Telemetry Overhead</div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-emerald-400 font-bold tracking-tight">
                          €{monthlySpend.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400">/ €500 limit</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-500"
                          style={{ width: `${(monthlySpend / 500) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-[9px] text-slate-500 pt-1">
                        Frankfurt clusters bill: Locked Zone
                      </div>
                    </div>

                  </div>

                  {/* MCP Diagnostics status indicator row */}
                  <div className="pt-3 border-t border-slate-850 text-[11px] font-mono">
                    <div className="text-slate-400 uppercase text-[10px] mb-2 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-500" />
                      <span>Model Context Protocol (MCP) Live Diagnostics schema status</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex items-center justify-between px-2.5 py-1 bg-slate-900/40 rounded border border-slate-850">
                        <span className="text-slate-350">sap_read_table</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1 bg-slate-900/40 rounded border border-slate-850">
                        <span className="text-slate-350">sovereign_db_proxy</span>
                        <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between px-2.5 py-1 bg-slate-900/40 rounded border border-slate-850 border-dashed">
                        <span className="text-slate-350">patient_registry_mcp</span>
                        <span className={`text-[9px] font-bold uppercase ${
                          selectedPresetId === "preset-ch-biotech" ? "text-cyan-400 animate-pulse" : "text-slate-500"
                        }`}>
                          {selectedPresetId === "preset-ch-biotech" ? "ACTIVE CH" : "STANDBY"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Submittable Ingestion Console Input screen */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <h3 className="text-sm font-mono font-bold text-slate-350 uppercase flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Sovereign Ingestion script input</span>
                    </h3>
                    <button
                      onClick={() => {
                        const originalPreset = ENTERPRISE_PRESETS.find(p => p.id === selectedPresetId);
                        if (originalPreset) {
                          setCustomInput(originalPreset.sampleData);
                          setToastMessage("Reset data payload.");
                        }
                      }}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-350 transition flex items-center gap-1 scroll-p-2"
                      title="Anonymize sample to standard state"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Preset Raw Input</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      Edit details below (you can add names, test private keys, IPs, and chassis numbers to analyze how real-time GDPR filters redact personal items)!
                    </p>
                    
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-950 border border-slate-850 p-3 rounded-lg text-slate-100 font-mono text-xs focus:border-emerald-500/60 transition scrollbar"
                      id="text-ingestion-payload-input"
                    />

                    {/* Trigger Button */}
                    <div className="flex justify-end p-0.5">
                      <button
                        onClick={triggerSovereignIngestion}
                        disabled={isProcessing}
                        className={`w-full md:w-auto px-6 py-3 rounded-lg font-mono text-xs font-bold transition flex items-center justify-center gap-2 ${
                          isProcessing
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                            : "bg-emerald-500 hover:bg-emerald-400 text-[#070913] cursor-pointer shadow-lg shadow-emerald-500/10 focus:ring-2 focus:ring-emerald-400"
                        }`}
                        id="btn-trigger-ingestion"
                      >
                        {isProcessing ? (
                          <>
                            <Activity className="w-4 h-4 animate-spin" />
                            <span>PROCESSING THROUGH DUAL-AGENT LANGRAPH LOOP...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>EXECUTE SECURE SOVEREIGN ANALYSIS</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sub-Section C: Visual Outputs, LangGraph tracings and Compliance Evaluations */}
                <div className="space-y-4">
                  {analysisResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                      id="analytical-results-block"
                    >
                      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/45">
                        <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-850 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs font-mono font-bold text-white uppercase tracking-tight">
                              PIPELINE INGESTION COMPLETED
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Latency: <strong className="text-cyan-400 font-mono">{analysisResult.latencyMs}ms</strong>
                          </span>
                        </div>

                        {/* Ingested output logs and score card matrix */}
                        <div className="p-5 space-y-5">
                          
                          {/* Real-time Sovereign Evaluation scores */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-center ${getScoreColor(analysisResult.evaluationScores.sovereignty)}`}>
                              <Shield className="w-5 h-5" />
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Sovereignty Compliance</span>
                              <strong className="text-xl font-mono font-bold">{analysisResult.evaluationScores.sovereignty}%</strong>
                            </div>
                            <div className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-center ${getScoreColor(analysisResult.evaluationScores.regulatoryAdherence)}`}>
                              <Lock className="w-5 h-5" />
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">GDPR Adherence</span>
                              <strong className="text-xl font-mono font-bold">{analysisResult.evaluationScores.regulatoryAdherence}%</strong>
                            </div>
                            <div className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 text-center ${getScoreColor(analysisResult.evaluationScores.hallucinationIndex)}`}>
                              <Eye className="w-5 h-5" />
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Factuality Index</span>
                              <strong className="text-xl font-mono font-bold">{analysisResult.evaluationScores.hallucinationIndex}%</strong>
                            </div>
                          </div>

                          {/* Dual tab view of output string: Raw vs. Scrubbed */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-tight">
                                Transformed Payload Output
                              </span>
                              <div className="flex gap-1.5 text-[10px] font-mono">
                                <button
                                  onClick={() => setActiveTabDetails("raw")}
                                  className={`px-3 py-1 rounded transition ${
                                    activeTabDetails === "raw" ? "bg-slate-800 text-slate-200 border border-slate-700" : "text-slate-500 hover:text-slate-300"
                                  }`}
                                  id="tab-details-raw"
                                >
                                  Raw Script Input
                                </button>
                                <button
                                  onClick={() => setActiveTabDetails("scrubbed")}
                                  className={`px-3 py-1 rounded transition ${
                                    activeTabDetails === "scrubbed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:text-slate-350"
                                  }`}
                                  id="tab-details-scrubbed"
                                >
                                  Compliance Anonymized Frame
                                </button>
                              </div>
                            </div>

                            <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg max-h-[180px] overflow-y-auto scrollbar">
                              {activeTabDetails === "raw" ? (
                                <p className="font-mono text-[11px] text-slate-400 whitespace-pre-wrap break-all">{customInput}</p>
                              ) : (
                                <div className="space-y-3">
                                  <p className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap break-all">{analysisResult.scrubbedText}</p>
                                  {gdprEnabled && analysisResult.gdprScrubbedItems.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-slate-900">
                                      <div className="text-[10px] font-mono text-amber-400 font-bold mb-1.5 uppercase flex items-center gap-1">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span>Masked Regulatory Attributes In Scope:</span>
                                      </div>
                                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 font-mono text-[10px] text-slate-400">
                                        {analysisResult.gdprScrubbedItems.map((scrubbed, idx) => (
                                          <li key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded">
                                            <span className="w-1 h-1 rounded bg-amber-400 shrink-0"></span>
                                            <span className="truncate">{scrubbed}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dynamic LangGraph steps trace trace trees */}
                          <div className="space-y-3.5">
                            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-tight block border-b border-slate-800 pb-2">
                              LangGraph Autonomous Step Trace Loop
                            </span>
                            <div className="space-y-4 font-mono text-xs border-l-2 border-slate-800/80 pl-4 mt-2">
                              {analysisResult.agentLogs.map((step, idx) => (
                                <div key={step.id || idx} className="relative">
                                  {/* Node circular marker icon */}
                                  <div className="absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <strong className="text-white font-mono font-bold">{step.nodeName}</strong>
                                      <span className="text-[10px] text-slate-500 font-mono">
                                        {step.durationMs}ms | {step.timestamp.split("T")[1].substring(0, 8)}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-350 leading-relaxed font-sans">{step.logMessage}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Initial Placeholder state explaining the Sandbox center actions */
                    <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-4">
                      <div className="flex justify-center">
                        <Terminal className="w-10 h-10 text-slate-600 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-mono text-slate-300 font-bold">No active transactional analysis loaded in viewport</h4>
                        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-normal mt-1.5">
                          Select a regional DACH preset or paste any custom data script in the command panel, configure the scrubbing parameters, and execute compile trace to monitor real-time compliant ingestion.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* 2. PRODUCTION CODE BLUEPRINTS */}
          {activeTab === "blueprints" && (
            <div className="space-y-6 animate-fadeIn" id="blueprints-container">
              
              <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <span>Validated Sovereign Infrastructure Code Archive</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    This module exposes direct, production-grade TypeScript and Terraform formats demonstrating FDE level cloud architectures. Fully aligned with secure regional perimeters.
                  </p>
                </div>

                {/* Categories Switchers */}
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {["LangGraph", "Model Context Protocol", "Terraform", "Evaluation Pipeline"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedBlueprintCategory(cat);
                        setAnalysisResult(null); // prevent collision
                      }}
                      className={`px-3 py-1.5 rounded-lg cursor-pointer transition ${
                        selectedBlueprintCategory === cat
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold"
                          : "bg-slate-950/60 border border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                      id={`blueprint-cat-btn-${cat.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blueprints listing view matching selected filters */}
              <div className="grid grid-cols-1 gap-6">
                {CODE_BLUEPRINTS.filter(b => b.category === selectedBlueprintCategory).map((bp) => (
                  <div key={bp.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/40">
                    
                    {/* Header bar controls of Code Panel */}
                    <div className="bg-slate-950 px-5 py-4 border-b border-slate-850 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-widest font-bold uppercase py-0.5 px-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {bp.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            Lang: {bp.language}
                          </span>
                        </div>
                        <h4 className="text-sm font-mono font-bold text-white tracking-wide mt-1">
                          {bp.title}
                        </h4>
                      </div>

                      {/* Immediate Copy button action */}
                      <button
                        onClick={() => copyBlueprintCode(bp.id, bp.code)}
                        className={`flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-xs font-mono font-bold transition duration-150 border cursor-pointer ${
                          copiedId === bp.id
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-900 hover:bg-slate-850 border-slate-700 text-slate-300 hover:text-white"
                        }`}
                        id={`btn-copy-${bp.id}`}
                      >
                        {copiedId === bp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>COPIED SECURELY</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>COPY CODE</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Meta parameters segment */}
                    <div className="p-4 bg-slate-950/40 border-b border-slate-850 text-xs font-sans text-slate-350 leading-relaxed">
                      {bp.description}
                    </div>

                    {/* Preformated code viewport */}
                    <div className="p-4 bg-slate-950 overflow-x-auto scrollbar max-h-[460px]">
                      <pre className="font-mono text-[11px] text-cyan-100/90 whitespace-pre leading-5 selection:bg-cyan-500/45">
                        <code>{bp.code}</code>
                      </pre>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. GOOGLE CLOUD FDE EXPERIENCE MAP */}
          {activeTab === "matrix" && (
            <div className="space-y-6 animate-fadeIn" id="matrix-container">
              
              <div className="bg-slate-905 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-[#10b981] to-cyan-500"></div>
                
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Interactive FDE Qualifications & Platform Evidence Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1.5 font-sans">
                  Google Cloud Forward Deployed Engineers operate directly alongside strategic DACH enterprise technical stakeholders. 
                  This matrix pairs typical recruiter screening requirements (technical qualifiers) directly to operational validations demonstrated live inside this Workspace dashboard environment.
                </p>
              </div>

              {/* Grid of Qualification items mapped directly */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FDE_QUALIFICATIONS.map((qual) => {
                  const isHighlighted = matrixHighlightedId === qual.id;
                  return (
                    <div
                      key={qual.id}
                      onClick={() => setMatrixHighlightedId(isHighlighted ? null : qual.id)}
                      className={`p-5 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                        isHighlighted
                          ? "bg-slate-900 border-amber-500 shadow-md shadow-amber-500/5 scale-[1.01]"
                          : "bg-slate-950/60 border-slate-850 hover:border-slate-700 hover:bg-slate-900/30"
                      }`}
                      id={`qual-block-${qual.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-850 pb-2.5">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono tracking-widest font-semibold uppercase text-amber-400">
                              RECRUITER SEARCH KEYWORD: "{qual.recruiterKeyword}"
                            </span>
                            <h4 className="text-sm font-mono font-bold text-white tracking-tight">
                              {qual.title}
                            </h4>
                          </div>
                          
                          {/* Chevron display status */}
                          <div className={`p-1 rounded bg-slate-900 border border-slate-850 transition ${
                            isHighlighted ? "text-amber-400 rotate-90" : "text-slate-500"
                          }`}>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <p className="text-xs text-slate-350 leading-relaxed font-sans cursor-text">
                          {qual.description}
                        </p>

                        {/* Interactive toggle block for in-tact requirements */}
                        <AnimatePresence>
                          {isHighlighted && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden space-y-3 pt-2.5"
                            >
                              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                                Verified Capabilities inside this Workspace:
                              </div>
                              <div className="grid grid-cols-1 gap-1.5 pl-2 font-mono text-[10px] text-slate-400">
                                {qual.detailedRequirements.map((req, rid) => (
                                  <div key={rid} className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20 px-0.5" />
                                    <span>{req}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-850 gap-2 flex flex-col justify-end text-[11px] font-mono">
                        <div className="flex gap-1.5 items-start">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="text-slate-400 leading-normal font-sans">
                            <strong className="text-amber-400">Sandbox Evidence:</strong> {qual.demonstrationContext}
                          </span>
                        </div>
                        
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (qual.relatedFeatureId === "langgraph" || qual.relatedFeatureId === "gdpr" || qual.relatedFeatureId === "telemetry") {
                                setActiveTab("sandbox");
                                if (qual.relatedFeatureId === "langgraph") setSelectedPresetId("preset-ch-biotech");
                                if (qual.relatedFeatureId === "gdpr") setSelectedPresetId("preset-de-auto");
                                setToastMessage(`Switched context to Sandbox targeting ${qual.title} characteristics.`);
                              } else {
                                setActiveTab("blueprints");
                                if (qual.relatedFeatureId === "mcp") setSelectedBlueprintCategory("Model Context Protocol");
                                if (qual.relatedFeatureId === "telemetry") setSelectedBlueprintCategory("Terraform");
                                setToastMessage(`Switched blueprints view corresponding to ${qual.title}.`);
                              }
                            }}
                            className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 border-b border-transparent hover:border-cyan-400 transition cursor-pointer"
                          >
                            <span>Inspect Evidence Artifacts</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

      </main>

      {/* Modern Compliant Footer */}
      <footer className="border-t border-slate-800 bg-[#060810] py-8 text-xs font-mono text-slate-500" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Google Cloud FDE Portfolio Compliance Engine v1.2.0 • air-gapped simulation framework</span>
          </div>
          <div>
            <span>Region boundaries: Frankfurt Cluster Nodes • Zone: europe-west3</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
