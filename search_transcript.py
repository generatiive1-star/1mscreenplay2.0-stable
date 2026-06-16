import json

log_path = r"C:\Users\penta\.gemini\antigravity\brain\7e8bb87f-3914-4bb7-8644-ac9596b4e8a6\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        data = json.loads(line)
        content = data.get('content', '')
        if not content:
            continue
        # Check for interesting words
        content_str = str(content)
        if any(w in content_str for w in ["virtualPages", "getNumberOfPages", "mismatch", "mismatch", "mismatch", "Fail-Safe", "New Export"]):
            print(f"Step {data.get('step_index')}: {content_str[:300]}...\n")
