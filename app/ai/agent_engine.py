"""OpsMind AI Agent Engine orchestrating Hindsight persistent memory and LLM reasoning."""

import json
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.hindsight_engine import HindsightEngine, hindsight_engine
from app.ai.llm_client import LLMClient, llm_client
from app.ai.prompt_templates import (
    DIAGNOSTIC_ANALYSIS_PROMPT,
    INCIDENT_MEMORY_RETAIN_TEMPLATE,
    POSTMORTEM_GENERATION_PROMPT,
    SRE_SYSTEM_PROMPT
)
from app.core.logging import logger
from app.models.conversation import Conversation
from app.models.incident import Incident
from app.models.message import Message
from app.models.user import User


class OpsMindAgent:
    """Enterprise SRE AI Agent that learns continuously using Hindsight persistent memory."""

    def __init__(
        self,
        memory_engine: Optional[HindsightEngine] = None,
        llm: Optional[LLMClient] = None
    ):
        self.memory_engine = memory_engine or hindsight_engine
        self.llm = llm or llm_client

    async def chat(
        self,
        db: AsyncSession,
        user: User,
        message_content: str,
        conversation_id: Optional[str] = None,
        service_name: str = "default",
        incident_id: Optional[str] = None,
        include_reflection: bool = False,
        auto_retain: bool = True
    ) -> Dict[str, Any]:
        """Execute a conversational interaction grounded in Hindsight persistent memories."""
        # 1. Resolve or create conversation
        bank_id = self.memory_engine.build_bank_id(user.team_id, service_name)

        if conversation_id:
            from app.repositories.conversation_repo import ConversationRepository
            conv_repo = ConversationRepository(db)
            conversation = await conv_repo.get_by_id(conversation_id)
            if not conversation:
                conversation = Conversation(
                    title=f"Chat about {service_name}",
                    incident_id=incident_id,
                    user_id=user.id,
                    service_name=service_name,
                    hindsight_bank_id=bank_id
                )
                await conv_repo.create(conversation)
        else:
            from app.repositories.conversation_repo import ConversationRepository
            conv_repo = ConversationRepository(db)
            conversation = Conversation(
                title=f"Incident Analysis: {message_content[:40]}...",
                incident_id=incident_id,
                user_id=user.id,
                service_name=service_name,
                hindsight_bank_id=bank_id
            )
            await conv_repo.create(conversation)

        # 2. Persist user message to DB
        user_msg = Message(
            conversation_id=conversation.id,
            sender="user",
            content=message_content
        )
        await conv_repo.add_message(user_msg)

        # 3. Retrieve relevant past memories from Hindsight
        recall_res = await self.memory_engine.arecall(
            bank_id=bank_id,
            query=message_content,
            max_tokens=3000
        )
        recalled_memories = recall_res.get("memories", [])
        formatted_memories = recall_res.get("formatted_prompt", "No prior memories recorded.")

        # 4. Optional reflection synthesis from Hindsight
        reflection_text = ""
        if include_reflection:
            reflect_res = await self.memory_engine.areflect(
                bank_id=bank_id,
                query=f"Synthesize recurrent architectural weaknesses, recurring bugs, or failed fixes related to: {message_content}"
            )
            reflection_text = reflect_res.get("reflection", "")

        # 5. Build LLM conversation messages
        messages = [
            {"role": "system", "content": SRE_SYSTEM_PROMPT},
            {
                "role": "system",
                "content": f"=== RECALLED MEMORIES FROM HINDSIGHT FOR SERVICE '{service_name}' ===\n{formatted_memories}\n\n=== REFLECTION INSIGHTS ===\n{reflection_text}"
            }
        ]

        # Ingest recent conversation history for multi-turn coherence
        recent_messages = await conv_repo.list_messages(conversation.id, limit=6)
        for rm in recent_messages:
            if rm.id != user_msg.id:
                messages.append({
                    "role": "assistant" if rm.sender == "agent" else "user",
                    "content": rm.content
                })

        messages.append({"role": "user", "content": message_content})

        # 6. Generate response from Groq LLM
        completion = await self.llm.generate_completion(messages=messages)
        agent_reply_content = completion["content"]
        tokens_used = completion.get("tokens_used", 0)
        model_used = completion.get("model", "groq-sre")

        # 7. Persist agent reply to DB
        agent_msg = Message(
            conversation_id=conversation.id,
            sender="agent",
            content=agent_reply_content,
            memories_recalled=json.dumps(recalled_memories) if recalled_memories else None,
            reflection_summary=reflection_text if reflection_text else None,
            model_used=model_used,
            tokens_used=tokens_used
        )
        await conv_repo.add_message(agent_msg)

        # 8. Retain useful interaction to Hindsight if requested
        retained = False
        if auto_retain and len(message_content) > 30:
            retain_summary = f"User asked regarding '{service_name}': {message_content}\nOpsMind Guidance: {agent_reply_content[:300]}..."
            await self.memory_engine.aretain(
                bank_id=bank_id,
                content=retain_summary,
                tags=[service_name, "chat-interaction"]
            )
            retained = True

        return {
            "response": agent_reply_content,
            "conversation_id": conversation.id,
            "message_id": agent_msg.id,
            "memories_recalled": recalled_memories,
            "reflection_summary": reflection_text if reflection_text else None,
            "model_used": model_used,
            "tokens_used": tokens_used,
            "memory_retained": retained
        }

    async def diagnose_incident(
        self,
        db: AsyncSession,
        user: User,
        service_name: str,
        error_logs: str,
        symptoms: Optional[str] = None,
        severity: str = "P2"
    ) -> Dict[str, Any]:
        """Diagnose an active incident by correlating logs with historical Hindsight memories."""
        bank_id = self.memory_engine.build_bank_id(user.team_id, service_name)

        # 1. Recall historical incidents with similar errors or symptoms
        query_text = f"Incident on {service_name}: {symptoms or ''}\nErrors: {error_logs[:1000]}"
        recall_res = await self.memory_engine.arecall(
            bank_id=bank_id,
            query=query_text,
            max_tokens=4000
        )
        recalled_memories = recall_res.get("memories", [])
        formatted_memories = recall_res.get("formatted_prompt", "No historical incident records found.")

        # 2. Query reflection on failure patterns
        reflect_res = await self.memory_engine.areflect(
            bank_id=bank_id,
            query=f"What are the most common root causes and failed mitigations seen for {service_name}?"
        )
        reflection_summary = reflect_res.get("reflection", "No reflection data available.")

        # 3. Build diagnostic prompt
        prompt = DIAGNOSTIC_ANALYSIS_PROMPT.format(
            service_name=service_name,
            severity=severity,
            symptoms=symptoms or "Service degradation / error rate spike",
            log_language="text",
            error_logs=error_logs,
            recalled_memories=formatted_memories,
            reflection_summary=reflection_summary
        )

        messages = [
            {"role": "system", "content": SRE_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]

        # 4. Invoke LLM
        completion = await self.llm.generate_completion(messages=messages)
        analysis_text = completion["content"]

        return {
            "service_name": service_name,
            "root_cause_hypothesis": analysis_text,
            "confidence_level": "high" if len(recalled_memories) > 0 else "medium",
            "past_similar_incidents": recalled_memories,
            "past_learnings_applied": [f"Correlated against {len(recalled_memories)} past memories from Hindsight bank '{bank_id}'"],
            "recommended_actions": [
                "Inspect database connection pool",
                "Review recent config/deployment changes",
                "Execute verified mitigation runbook"
            ],
            "anti_patterns_to_avoid": [
                "Avoid restarting dependent services simultaneously (cascading failure risk)",
                "Do not bypass rate limiters during recovery"
            ],
            "hindsight_bank_id": bank_id
        }

    async def generate_postmortem(
        self,
        db: AsyncSession,
        incident: Incident,
        user: User,
        include_reflection: bool = True
    ) -> Dict[str, Any]:
        """Generate a blameless postmortem and retain its learnings into Hindsight."""
        bank_id = incident.hindsight_bank_id or self.memory_engine.build_bank_id(user.team_id, incident.service_name)

        # 1. Recall related incidents
        recall_res = await self.memory_engine.arecall(
            bank_id=bank_id,
            query=f"{incident.title} {incident.root_cause or ''} {incident.mitigation_steps or ''}"
        )
        recalled_memories = recall_res.get("memories", [])
        formatted_memories = recall_res.get("formatted_prompt", "None.")

        # 2. Reflect on cross-incident trends
        reflection_text = ""
        if include_reflection:
            reflect_res = await self.memory_engine.areflect(
                bank_id=bank_id,
                query=f"Analyze repeat failure trends for {incident.service_name} over the past quarter."
            )
            reflection_text = reflect_res.get("reflection", "")

        # 3. Construct postmortem prompt
        prompt = POSTMORTEM_GENERATION_PROMPT.format(
            incident_id=incident.id,
            title=incident.title,
            service_name=incident.service_name,
            severity=incident.severity,
            time_to_mitigate_mins=incident.time_to_mitigate_mins or 30,
            root_cause=incident.root_cause or "Underlying configuration / resource starvation",
            mitigation_steps=incident.mitigation_steps or "Applied runbook fix and verified health",
            recalled_memories=formatted_memories,
            reflection_summary=reflection_text
        )

        messages = [
            {"role": "system", "content": SRE_SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ]

        completion = await self.llm.generate_completion(messages=messages)
        postmortem_content = completion["content"]

        # 4. Retain this verified postmortem knowledge permanently into Hindsight!
        memory_content = INCIDENT_MEMORY_RETAIN_TEMPLATE.format(
            service_name=incident.service_name,
            severity=incident.severity,
            title=incident.title,
            error_summary=(incident.error_logs[:200] if incident.error_logs else "No raw logs"),
            root_cause=incident.root_cause or "Not specified",
            mitigation_steps=incident.mitigation_steps or "Not specified",
            time_to_mitigate_mins=incident.time_to_mitigate_mins or 0,
            runbook_notes=f"Postmortem documented for incident {incident.id}"
        )

        retain_res = await self.memory_engine.aretain(
            bank_id=bank_id,
            content=memory_content,
            tags=[incident.service_name, incident.severity, "postmortem", "resolution"],
            metadata={
                "incident_id": incident.id,
                "service": incident.service_name,
                "severity": incident.severity
            }
        )

        return {
            "incident_id": incident.id,
            "title": incident.title,
            "service_name": incident.service_name,
            "postmortem_markdown": postmortem_content,
            "systemic_patterns": reflection_text if reflection_text else None,
            "hindsight_retained": retain_res.get("success", False),
            "hindsight_bank_id": bank_id
        }


# Global singleton instance
agent_engine = OpsMindAgent()

