"""
run_tests.py - Standalone test runner for IncidentIQ AI Agent.
Executes all verification tests for Groq, Hindsight operations, retention,
recall, reflection, learning, and repeat incident recommendation.
"""

import sys
import subprocess
from pathlib import Path

def main():
    print("=" * 70)
    print("INCIDENTIQ AI AGENT - COMPREHENSIVE TEST SUITE")
    print("=" * 70)

    test_file = Path(__file__).parent / "tests" / "test_agent.py"
    cmd = [
        sys.executable,
        "-m",
        "pytest",
        str(test_file),
        "-v",
        "-s",
    ]

    print(f"Executing: {' '.join(cmd)}\n")
    result = subprocess.run(cmd)
    sys.exit(result.returncode)

if __name__ == "__main__":
    main()

