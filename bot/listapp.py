import requests
from dotenv import load_dotenv
import os 

load_dotenv()
url = os.environ.get('MAIN_URL')
tl_id = 871787184

data = {
    'telegram_id': 871787184
}
final_url = f'http://{url}/get_telegram_user?telegram_id={tl_id}'
print(final_url)
response = requests.get(f'http://{url}/get_telegram_user?telegram_id={tl_id}')

# get the atribute "access_token" from the response
exit()
token = response.json()['access_token']
print(token)

# res = requests.get(f'http://listapp.be.sexy:8000/get_items', headers={'Authorization': f'Bearer {token}'})

# print(res.text)

