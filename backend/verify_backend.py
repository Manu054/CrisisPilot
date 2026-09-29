import httpx

with httpx.Client(base_url='http://127.0.0.1:8000', timeout=30.0) as client:
    # 1. Login
    login_res = client.post('/api/auth/login', json={'email': 'sarah.morgan@acmeretail.com', 'password': 'Password123!'})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    print('[1] Login OK. Authenticated as Sarah Morgan.')

    # 2. Get Demo Crisis
    crisis_res = client.get('/api/crises/44444444-4444-4444-4444-444444444444', headers=headers)
    assert crisis_res.status_code == 200, f"Crisis get failed: {crisis_res.text}"
    crisis = crisis_res.json()
    print(f'[2] Fetched Demo Crisis: {crisis["title"]} | Status: {crisis["status"]}')

    # 3. Get Recommendations (CrisisAnalysisResponse)
    rec_res = client.get('/api/recommendations/44444444-4444-4444-4444-444444444444', headers=headers)
    assert rec_res.status_code == 200, f"Rec failed: {rec_res.text}"
    analysis = rec_res.json()
    rec_data = analysis["recommendation"]
    print(f'[3] AI Recommendation: {rec_data["strategy"]} | Confidence: {rec_data["confidence"]} | Strategies Evaluated: {len(analysis["strategies"])}')

    # 4. Get Memory Insights
    insights_res = client.get('/api/memory/insights', headers=headers)
    assert insights_res.status_code == 200, f"Insights failed: {insights_res.text}"
    insights = insights_res.json()
    print(f'[4] Organizational Memory Insights: {len(insights)} principles cataloged.')

    # 5. Get Dashboard Summary
    dash_res = client.get('/api/dashboard/summary', headers=headers)
    assert dash_res.status_code == 200, f"Dashboard failed: {dash_res.text}"
    dash = dash_res.json()
    print(f'[5] Dashboard Summary: Total Inventory: INR {dash["total_inventory"]:,.0f} | Monitored SKUs: {dash["monitored_skus"]}')

    # 6. Test AI Chat with HindSight context
    chat_res = client.post('/api/ai/chat', json={
        "message": "Why did you recommend 15% discount with bundle for Product X?",
        "crisis_id": "44444444-4444-4444-4444-444444444444"
    }, headers=headers)
    assert chat_res.status_code == 200, f"Chat failed: {chat_res.text}"
    chat_data = chat_res.json()
    # 7. Create & Execute Decision (Closing Organizational Memory Loop)
    create_d_res = client.post('/api/decisions', json={
        "crisis_id": "44444444-4444-4444-4444-444444444444",
        "strategy_type": "bundle",
        "parameters": {"discount_percentage": 0.15, "bundle_item": "Accessory Kit", "duration_days": 60},
        "expected_outcome": {"clearance": 0.72, "margin_change": -0.18}
    }, headers=headers)
    assert create_d_res.status_code == 200, f"Create decision failed: {create_d_res.text}"
    decision_id = create_d_res.json()["id"]

    exec_res = client.post(f'/api/decisions/{decision_id}/execute', headers=headers)
    assert exec_res.status_code == 200, f"Execute failed: {exec_res.text}"
    decision_data = exec_res.json()
    print(f'[7] Decision Created & Executed: ID {decision_id} | Status: {decision_data["status"]}')

    # 8. Record Real-World Outcome -> Retain in HindSight
    outcome_res = client.post(f'/api/decisions/{decision_id}/outcome', json={
        "inventory_cleared": 0.74,
        "revenue": 37200000.0,
        "margin": -0.17,
        "time_to_clear": 52,
        "customer_response": "High conversion on accessory bundle; customer satisfaction rating 4.6/5.",
        "notes": "Accessory bundle absorbed price perception drop, clearing 74% stock in 52 days."
    }, headers=headers)
    assert outcome_res.status_code == 200, f"Outcome recording failed: {outcome_res.text}"
    outcome_data = outcome_res.json()
    assert outcome_data["hindsight_memory_updated"] is True
    print(f'[8] Real Outcome Recorded & Retained to HindSight! Decision ID: {outcome_data["decision_id"]} | Outcome ID: {outcome_data["outcome_id"]}')

    print('\n>>> COMPLETE CLOSED-LOOP ORGANIZATIONAL MEMORY VERIFICATION PASSED! <<<')
