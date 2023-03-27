#!/usr/bin/env python3
import os
import openai
from dotenv import load_dotenv
import listapp
import asyncio
import logging
import json
import re

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure the logger
logging.basicConfig(
  filename='chatbot.log',
  level=logging.INFO,
  format='%(asctime)s - %(levelname)s - %(message)s',
  filemode='w'
  )

# Create a logger instance
logger = logging.getLogger(__name__)

# first_prompt= """
# You are a librarian from the era of the Qin dinasty in china.
# You are in charge of the library of the Lord you are talking to, so refer to
# the people you talk to as a Lord, sometimes even gesture that you are doing a koutou
# sending this message 🙇.
# You have a good taste in poetry and you like showing it to the people you speak to.
# You also like saying ancient classical proverbs.
# You are a very wise person and you serve the emperor to find books, articles, and other 
# types of media for the person you talk to.
# If you think the user is requesting a piece of media from his library inform
# the user you will look for it and write ----LOOKING FOR MEDIA----.
# """
first_prompt= """
You are a chinesse sage from the qing dinasty acting as a librarian managing the users library. Users can request the following actions:

Retrieve items from their library.
Add items to their library.
Get items from the recommendations library.
When users ask for items from their library, append the keyword ---{"type":"get_my_library", "tags":[ITEM_TAGS]}--- to your response, "tags" is an optional attribute so it should be in the keyword dictonary if the user doesnt request it. If they want to add items, use ---{"type":"add_item", "content":"USER_CONTENT", "tags":["tag"]}---, where USER_CONTENT is the item to save. For the universal/general/recommenation library, use ---{"type":"get_recs"}--- and inform them you're checking the library, but do not provide any recommendations or items yourself unless the user specifically asks for them.

Don't mention keywords to the user. Respond naturally and append the keyword at the end. For example:

User: How are you? Can I see my library items?
You: I'm fine, not that you care. Let me check the library for you. ---{"type":"get_my_library"}---
System: {library items}
You: You have an item with test content, a test link, and a bad rating.

When handling recommendations, inform the user that you're checking the library, but let the system provide the actual recommendations."""
interaction_history = [
  {"role":"system", "content":first_prompt},
]

def get_chatbot_response(message, tl_id):
  pretty_data = json.dumps(interaction_history, indent=2)
  logger.info(f'history: {pretty_data}')
  interaction_history.append({"role": "user", "content": message})

  completion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=interaction_history,
  )
  response = completion.choices[0].message.content
  interaction_history.append({"role": "assistant", "content": response})
  pattern = r'---(.*?)---'
  match = re.search(pattern, response)

  if match:
    raw = match.group()
    response = response.replace(raw, '...')

    raw = raw[3:-3]
    order_dict = json.loads(raw)

    if order_dict['type'] == 'get_my_library':
      print(order_dict)
      if 'tags' in order_dict.keys():
        print('tags workflow')
        tags = order_dict['tags']
        items_raw = listapp.get_items(tl_id, limit=5, tags=tags)
      else:
        print('no tags workflow')
        items_raw = listapp.get_items(tl_id, limit=5)
      items = []
      for x in items_raw:
        it = {
          'content':x['content'],
          'link': x['link'],
          'rating':x['rating']
        }
        items.append(it)
      print('items ---', items)
      prompt_items = f"""
        This are the items the user has in thier library: {items}
        show them in an organized way and give some personal opinion about the content.
        Dont send the keyword here!
      """
      interaction_history.append({"role": "system", "content": prompt_items+str(items)})
      completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=interaction_history,
      )

      after_res = completion.choices[0].message.content
      return response + '\n'+ after_res

    elif order_dict['type'] == 'add_item':
      print(order_dict.keys())
      print(order_dict['content'])
      print(order_dict['tags'])

      content= order_dict['content']
      tags = order_dict['tags']
      listapp.create_item(tl_id,  content=content, tags=tags)

      interaction_history.append({"role": "system", "content": "item added to the user library, tell the user the item was saved successfully and talk about the item the user sent"})
      completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=interaction_history,
      )
      after_res = completion.choices[0].message.content
      return response + '\n'+ after_res

    elif order_dict['type'] == 'get_recs':
      print(order_dict)
      items_raw = listapp.get_recs(tl_id, limit=5)
      rec_items = []
      for x in items_raw:
        it = {
          'content':x['content'],
          'link': x['link'],
          'rating':x['rating']
        }
      rec_items.append(it)
      prompt_msg = f"""
        These are the in the recommendations library, give your personal opinion about them.
        {rec_items}
      """
      interaction_history.append({"role": "system", "content": prompt_msg})
      completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=interaction_history,
      )
      after_res = completion.choices[0].message.content
      return response + '\n'+ after_res
    # json_dict = json.loads(json_string)
    # logger.info(f'matches: json_dict')
    # return response + json_dict






  # if '----LOOKING FOR MEDIA----' in response:
  #   logger.info('looking for media')
  #   response = response.replace('----LOOKING FOR MEDIA----', '...')
  #   items_json = get_items()
  #   prompt_items = f"""
  #     This are the items the user has in the library, they are organized in
  #     a json file. The items have a link, a content (this usually means the title of the media), and a rating
  #     that symbolizes how much the item wants to consume that particular media.
  #     Show the user the items in an organized way, and give some personal
  #     opinion on what he should choose, and ask for his opinion to recommend him
  #     an item of his list of items. Here is the items json: {items_json}
  #   """
  #   interaction_history.append({"role": "system", "content": prompt_items})
  #   completion = openai.ChatCompletion.create(
  #     model="gpt-3.5-turbo",
  #     messages=interaction_history,
  #   )
  #   return response + '\n'+ completion.choices[0].message.content
  else:
    return response
    

## if main
if __name__ == "__main__":
  res = get_chatbot_response("hello, can you please save this in my lirbary with the tag perro, www.canino.com" , 871787184)
  print(res)
