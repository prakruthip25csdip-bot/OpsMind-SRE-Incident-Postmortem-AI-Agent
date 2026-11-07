"""
demo.py - Interactive CLI demonstration of IncidentIQ AI Agent.
Runs a live analysis on a sample incident, records an outcome, and performs a repeat query.
"""

import sys
import time
import subprocess
from ai_agent import process_incident, store_incident_outcome, get_memories
from ai_agent.config import settings
from ai_agent.hindsight_client import hindsight_client

def main():
    print("=" * 65)
    print("🚀 INCIDENTIQ AI AGENT - LIVE DEMO")
    print("=" * 65)

    # 1. Start local Hindsight server if needed
    proc = None
    if "127.0.0.1" in settings.HINDSIGHT_BASE_URL or "localhost" in settings.HINDSIGHT_BASE_URL:
        conn = hindsight_client.check_connection()
        if conn.get("status") != "connected":
            print("[INFO] Starting local Hindsight test server on port 8888...")
            proc = subprocess.Popen([sys.executable, "tests/hindsight_test_server.py", "8888"])
            time.sleep(2)

    try:
        # Step 1: Initial Incident
        print("\n--- 1. PROCESSING AN INCIDENT ---")
        incident_msg = (
            "CRITICAL: PostgreSQL database connection pool exhausted in auth-service. "
            "Error: Timeout: pool is full (size=10, active=10). All login requests returning HTTP 500."
        )
        print(f"Incident: {incident_msg}\n")
        
        analysis = process_incident(
            message=incident_msg,
            session_id="session-demo-01",
            service="auth-service",
            environment="production",
        )

        print(f"✅ Incident Summary : {analysis.incident_summary}")
        print(f"⚠️ Severity         : {analysis.severity}")
        print(f"🔍 Root Causes:")
        for rc in analysis.possible_root_causes:
            print(f"   - [{rc.likelihood}] {rc.description}")
        print(f"🛠️ Recommendations:")
        for rec in analysis.recommendations:
            mem = " (Backed by past memory)" if rec.is_supported_by_memory else ""
            print(f"   {rec.step_number}. [{rec.priority}] {rec.action}{mem}")

        # Step 2: Learning from a solution
        print("\n--- 2. DEVELOPER SOLVES THE ISSUE & STORES OUTCOME ---")
        solution_data = {
            "service": "auth-service",
            "attempted_solution": "Increased max_connections in db pool from 10 to 50 and set connection idle timeout to 30s.",
            "outcome": "success",
            "incident_summary": "DB pool exhaustion in auth-service",
            "resolution_notes": "Connections dropped to healthy level (<20 active). HTTP 500 errors resolved.",
            "session_id": "session-demo-01",
        }
        outcome_result = store_incident_outcome(solution_data)
        print(f"✅ Learning Saved: {outcome_result.message}")

        # Step 3: Repeated Incident shows memory in action
        print("\n--- 3. REPEATED INCIDENT (AGENT USES HINDSIGHT MEMORY) ---")
        repeat_msg = "auth-service experiencing slow logins and database pool timeout errors."
        repeat_analysis = process_incident(
            message=repeat_msg,
            session_id="session-demo-02",
            service="auth-service",
        )
        print(f"🧠 Memory Supported? : {repeat_analysis.supported_by_memory}")
        print(f"💡 Memory Explanation: {repeat_analysis.memory_support_explanation}")
        print(f"🛠️ Recommendations:")
        for rec in repeat_analysis.recommendations:
            mem = " ⭐ [BACKED BY PAST FIX]" if rec.is_supported_by_memory else ""
            print(f"   {rec.step_number}. [{rec.priority}] {rec.action}{mem}")

        print("\n" + "=" * 65)
        print("Demo completed successfully!")
        print("=" * 65)

    finally:
        if proc:
            proc.terminate()
            proc.wait(timeout=2)

if __name__ == "__main__":
    main()

