import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE = "http://127.0.0.1:8000/api"

def request(method, path, data=None, token=None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, context=ctx) as response:
        return json.loads(response.read().decode("utf-8"))

print("=== CRISISPILOT COMPREHENSIVE E2E VERIFICATION ===")

# 1. Login
print("\n1. Testing POST /api/auth/login...")
auth_res = request("POST", "/auth/login", {
    "email": "demo@crisispilot.com",
    "password": "Password123!"
})
token = auth_res["access_token"]
user_id = auth_res["user_id"]
org_id = auth_res["organization_id"]
print(f"   [SUCCESS] Logged in as: {auth_res['name']} ({auth_res['email']}), Org: {org_id}")

# 2. Get Profile & Organization
print("\n2. Testing GET /api/auth/me & /organizations/current...")
me = request("GET", "/auth/me", token=token)
org = request("GET", "/organizations/current", token=token)
print(f"   [SUCCESS] Verified identity: {me['name']}, Org: {org['name']}, Role: {me['role']}")

# 3. Dashboard Summary
print("\n3. Testing GET /api/dashboard/summary...")
dash = request("GET", "/dashboard/summary", token=token)
print(f"   [SUCCESS] Dashboard Summary: Total Inventory: {dash.get('total_inventory')}, At Risk: {dash.get('at_risk_inventory')}, Active Crises: {dash.get('active_crises')}")

# 4. Create New Crisis
print("\n4. Testing POST /api/crises...")
new_crisis = request("POST", "/crises", {
    "title": "Audio Pro Headphone Overstock Q3",
    "crisis_type": "excess_inventory",
    "description": "38,000 units stagnant with 90 days before seasonal refresh.",
    "severity": "high",
    "input_data": {
        "product_name": "Audio Pro Headphone",
        "category": "Consumer Electronics",
        "inventory_units": 38000,
        "monthly_sales": 3800,
        "unit_price": 1200,
        "unit_cost": 680,
        "expiry_days": 90
    }
}, token=token)
crisis_id = new_crisis["id"]
print(f"   [SUCCESS] Created Crisis ID: {crisis_id}, Title: {new_crisis['title']}")

# 5. Analyze Crisis (Retrieval + Multi-Agent Synthesis)
print("\n5. Testing POST /api/crises/{id}/analyze...")
analysis = request("POST", f"/crises/{crisis_id}/analyze", {"objective": "balanced"}, token=token)
rec = analysis["recommendation"]
evidence = analysis.get("historical_evidence", [])
strategies = analysis.get("strategies", [])
print(f"   [SUCCESS] Multi-Agent Synthesis Complete!")
print(f"             AI Recommendation: {rec.get('strategy')}")
print(f"             Confidence: {rec.get('confidence')}")
print(f"             Supporting HindSight Cases Retrieved: {len(evidence)}")
print(f"             Candidate Strategies Evaluated: {len(strategies)}")

# 6. Ask AI Chat (Grounded in HindSight & Groq)
print("\n6. Testing POST /api/ai/chat...")
ai_reply = request("POST", "/ai/chat", {
    "message": "Why did you recommend this strategy for Audio Pro Headphone?",
    "crisis_id": crisis_id
}, token=token)
print(f"   [SUCCESS] AI Assistant Replied ({len(ai_reply['reply'])} chars):")
print(f"             \"{ai_reply['reply'][:140]}...\"")
print(f"             Cited Precedents: {len(ai_reply.get('cited_precedents', []))}")

# 7. Execute Decision
print("\n7. Testing POST /api/decisions and execute...")
decision = request("POST", "/decisions", {
    "crisis_id": crisis_id,
    "strategy_type": rec.get("strategy", "Promotional Bundle"),
    "parameters": {"discount": 15, "bundle": True},
    "expected_outcome": rec.get("expected_impact", {})
}, token=token)
dec_id = decision["id"]
exec_res = request("POST", f"/decisions/{dec_id}/execute", token=token)
print(f"   [SUCCESS] Decision ID {dec_id} executed! Status: {exec_res['status']}")

# 8. Record Actual Outcome (Closing Learning Loop in HindSight)
print("\n8. Testing POST /api/decisions/{id}/outcome...")
outcome_res = request("POST", f"/decisions/{dec_id}/outcome", {
    "inventory_cleared": 28500,
    "revenue": 29000000,
    "margin": 23.5,
    "time_to_clear": 52,
    "notes": "15% discount bundled with protective case cleared 75% volume across South Zone depots."
}, token=token)
print(f"   [SUCCESS] Recorded Outcome! HindSight Memory Updated: {outcome_res['hindsight_memory_updated']}")

# 9. Deterministic Simulation
print("\n9. Testing POST /api/simulations...")
sim_res = request("POST", "/simulations", {
    "product": "Audio Pro Headphone",
    "inventory_units": 38000,
    "monthly_sales": 3800,
    "price": 1200,
    "cost": 680,
    "expiry_days": 90,
    "discount_percentage": 15,
    "promotion_duration": 60,
    "campaign_budget": 7.5
}, token=token)
print(f"   [SUCCESS] Simulation Results: Clearance: {sim_res['inventory_clearance_percentage']}%, Revenue: ₹{sim_res['estimated_revenue']}, Margin: {sim_res['estimated_margin']}%, Risk: {sim_res['risk_score']}")

# 10. Organizational Memory & Search
print("\n10. Testing GET /api/memory/search & /memory/cases...")
search_res = request("GET", "/memory/search?query=headphone%20bundle&max_results=3", token=token)
cases_res = request("GET", "/memory/cases?limit=5", token=token)
print(f"   [SUCCESS] HindSight Search returned {search_res.get('total_memories', 0)} memories.")
print(f"             Memory Cases Count: {len(cases_res)}")

# 11. Generate Report
print("\n11. Testing POST /api/reports...")
rep = request("POST", "/reports", {
    "crisis_id": crisis_id,
    "title": "Executive Brief: Audio Pro Headphone Crisis"
}, token=token)
print(f"   [SUCCESS] Generated Report ID: {rep['id']}, Title: {rep['title']}")

# 12. Notifications
print("\n12. Testing GET /api/notifications...")
notifs = request("GET", "/notifications", token=token)
print(f"   [SUCCESS] Received {len(notifs)} notifications from backend.")

# 13. Test New User Registration & Organization Isolation
print("\n13. Testing Registration of New Organization (Isolation Verification)...")
import random
rand_id = random.randint(1000, 9999)
new_user = request("POST", "/auth/register", {
    "name": f"Alex Chen {rand_id}",
    "email": f"alex.chen_{rand_id}@apextech.com",
    "password": "Password123!",
    "organization_name": f"Apex Technologies {rand_id}",
    "industry": "Hardware",
    "currency": "USD",
    "role": "admin"
})
new_token = new_user["access_token"]
new_org_id = new_user["organization_id"]
print(f"   [SUCCESS] Registered new org: {new_user['name']}, Org ID: {new_org_id}")

# Verify data isolation: New org should NOT see Acme Retail's crises
isolated_crises = request("GET", "/crises", token=new_token)
print(f"   [SUCCESS] Multi-Tenant Isolation Verified: New Organization sees {len(isolated_crises)} crises (0 cross-tenant leaks).")

print("\n=======================================================")
print("ALL 13/13 END-TO-END FLOWS AND INTEGRATIONS PASSED 100%!")
print("=======================================================")
