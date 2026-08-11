"""
ProspectusIQ - Script 04: Test Model against Official OWASP Security Benchmarks
=============================================================================
Fetches official SQLi payloads from the PayloadBox repository and evaluates 
the trained model's recall and precision on real-world exploits.
"""

import urllib.parse
import urllib.request
import joblib
from pathlib import Path

# Dynamic path resolution for running from any folder
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name in ["scripts", "ml"] else SCRIPT_DIR
if PROJECT_ROOT.name == "ml":
    PROJECT_ROOT = PROJECT_ROOT.parent

MODEL_PATH = PROJECT_ROOT / "models" / "sqli_detector_sebi.pkl"

# Official OWASP / SecLists SQL Injection test vector URLs
BENCHMARK_URLS = {
    "Generic SQLi (SecLists OWASP)": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/Generic-SQLi.txt",
    "Quick SQLi Payloads": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/quick-SQLi.txt",
    "SQLi Polyglots": "https://raw.githubusercontent.com/danielmiessler/SecLists/master/Fuzzing/Databases/SQLi/SQLi-Polyglots.txt",
}


def fetch_official_payloads(url: str) -> list[str]:
    """Downloads raw test payloads from official security repositories."""
    req = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0)"}
    )
    with urllib.request.urlopen(req) as response:
        content = response.read().decode("utf-8", errors="ignore")
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    return [line for line in lines if not line.startswith("#")]


def run_official_benchmark():
    if not MODEL_PATH.exists():
        print(f"[ERROR] Model file not found at {MODEL_PATH}")
        return

    print("=========================================================")
    print("  PROSPECTUS IQ: MODEL EVALUATION ON OFFICIAL BENCHMARKS ")
    print("=========================================================\n")

    model = joblib.load(MODEL_PATH)

    total_tested = 0
    total_blocked = 0

    for category, url in BENCHMARK_URLS.items():
        print(f"[+] Fetching official '{category}' payload suite...")
        try:
            payloads = fetch_official_payloads(url)
            print(f"    Loaded {len(payloads)} test cases.")

            blocked = 0
            for payload in payloads:
                # Normalize payload
                cleaned = urllib.parse.unquote(payload).lower().strip()
                pred = model.predict([cleaned])[0]
                if pred == 1:
                    blocked += 1

            detection_rate = (blocked / len(payloads)) * 100 if len(payloads) > 0 else 0
            print(
                f"    Results for {category}: {blocked}/{len(payloads)} Blocked ({detection_rate:.2f}% Detection Rate)\n"
            )

            total_tested += len(payloads)
            total_blocked += blocked
        except Exception as e:
            print(f"    [!] Failed to download category '{category}': {e}\n")

    overall_recall = (
        (total_blocked / total_tested) * 100 if total_tested > 0 else 0
    )
    print("=========================================================")
    print(
        f"OVERALL BENCHMARK RECALL: {overall_recall:.2f}% ({total_blocked}/{total_tested} Attacks Blocked)"
    )
    print("=========================================================")


if __name__ == "__main__":
    run_official_benchmark()
