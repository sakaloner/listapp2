
#!/usr/bin/env python3
import os
import openai
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Hello! I am andres. I want to speak with a chinesse library man from the Qin dynasty."}
  ]
)

print(completion.choices[0].message)
