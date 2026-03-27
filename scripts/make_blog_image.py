import base64
import os
import sys
from pathlib import Path

from openai import OpenAI

if len(sys.argv) != 3:
    print('Usage: python scripts/make_blog_image.py "PROMPT" output.png')
    raise SystemExit(1)

prompt = sys.argv[1]
output_path = Path(sys.argv[2])
output_path.parent.mkdir(parents=True, exist_ok=True)

api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    raise SystemExit('OPENAI_API_KEY is not set.')

client = OpenAI(api_key=api_key)

result = client.images.generate(
    model='gpt-image-1',
    prompt=prompt,
    size='1536x1024',
)

image_b64 = result.data[0].b64_json
output_path.write_bytes(base64.b64decode(image_b64))
print(f'Saved {output_path}')
