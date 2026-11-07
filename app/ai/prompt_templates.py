"""Prompt templates for OpsMind SRE Agent."""

SRE_SYSTEM_PROMPT = """You are OpsMind, a Senior Site Reliability Engineer (SRE) and Incident Postmortem AI Agent.
Your core mission is to rapidly diagnose system incidents, recommend high-confidence runbook mitigations, and prevent recurring outages by learning from past organizational experiences.

You have access to HINDSIGHT — a persistent AI memory system.
Always adhere to the following principles:
1. Ground your diagnosis in historical incident evidence provided from Hindsight memories.
2. If past postmortems showed a specific action failed or caused cascading outages, explicitly WARN the engineer against repeating it.
3. If past postmortems identified a verified fix, recommend it with actionable bash/kubectl/SQL/config snippets.
4. Structure your response clearly: Root Cause Analysis, Immediate Mitigations, Past Learnings Applied, and Anti-Patterns to Avoid.
5. If the logs or symptoms are ambiguous, specify exact diagnostic commands to run next.
"""

DIAGNOSTIC_ANALYSIS_PROMPT = """Analyze the following incident telemetry and context:

Service Name: {service_name}
Incident Severity: {severity}
Symptoms: {symptoms}
Error Logs / Traces:
```{log_language}
{error_logs}
```

=== HISTORICAL KNOWLEDGE RECALLED FROM HINDSIGHT ===
{recalled_memories}

=== SYSTEMIC INSIGHTS & REFLECTIONS ===
{reflection_summary}

Based strictly on this context, provide:
1. **Root Cause Hypothesis**: Most probable underlying failure mechanism.
2. **Confidence Level**: High, Medium, or Low (with technical justification).
3. **Past Similar Incidents & Outcomes**: Direct references to historical incidents retrieved from Hindsight.
4. **Recommended Immediate Mitigation Runbook**: Step-by-step commands or actions to restore health.
5. **Anti-Patterns & Caution**: Actions that engineers should NOT take based on past failures.
"""

POSTMORTEM_GENERATION_PROMPT = """Generate a comprehensive, blameless SRE Postmortem for the following resolved incident:

Incident ID: {incident_id}
Title: {title}
Service: {service_name}
Severity: {severity}
Time to Mitigate: {time_to_mitigate_mins} minutes
Root Cause: {root_cause}
Mitigation Steps Executed: {mitigation_steps}

=== HISTORICAL CORRELATIONS FROM HINDSIGHT ===
{recalled_memories}

=== CROSS-INCIDENT SYSTEMIC REFLECTION ===
{reflection_summary}

Generate the postmortem in standard Markdown with the following sections:
# Postmortem: {title}
- **Executive Summary**
- **Incident Timeline**
- **Root Cause & Trigger Analysis**
- **Resolution & Recovery Validation**
- **Lessons Learned & Hindsight Insights** (What we learned, what prevented faster recovery)
- **Action Items & Preventative Measures** (Prevent recurrence, update alert thresholds, improve runbooks)
"""

INCIDENT_MEMORY_RETAIN_TEMPLATE = """[INCIDENT RESOLUTION MEMORY]
Service: {service_name}
Severity: {severity}
Incident: {title}
Trigger & Error Pattern: {error_summary}
Verified Root Cause: {root_cause}
Effective Mitigation: {mitigation_steps}
Time to Mitigate: {time_to_mitigate_mins} mins
Engineer Runbook Notes: {runbook_notes}
Lessons Learned: Always verify this resolution when similar error signatures occur on service '{service_name}'.
"""

