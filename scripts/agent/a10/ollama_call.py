"""
A10 Ollama streaming caller.
Reads JSON from stdin: {"model": "...", "prompt": "...", "url": "..."}
Streams the response and writes full text to stdout.
No timeout - streams token by token until done.
"""
import sys
import json

def main():
    data = json.loads(sys.stdin.buffer.read().decode('utf-8-sig'))
    model  = data['model']
    prompt = data['prompt']
    url    = data.get('url', 'http://localhost:11434')

    import ollama
    client = ollama.Client(host=url)

    parts = []
    for chunk in client.generate(model=model, prompt=prompt, stream=True):
        token = chunk.get('response', '')
        if token:
            parts.append(token)
        if chunk.get('done'):
            break

    result = ''.join(parts)
    sys.stdout.buffer.write(result.encode('utf-8'))
    sys.stdout.buffer.flush()

if __name__ == '__main__':
    main()
