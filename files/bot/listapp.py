import requests
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from datetime import datetime
import json
import models
from models import item_tag_association
import database
from sqlalchemy import select
from sqlalchemy.sql import insert

### Load stuff
# Load env variables
load_dotenv()
url = os.environ.get('MAIN_URL')
# check connection with psql db
db = database.SessionLocal()

models.Base.metadata.create_all(bind=database.engine)


def get_user_from_db (tl_id):
    # search for an user
    result = db.query(models.TelegramUsers).filter(models.TelegramUsers.telegram_id == tl_id).first()
    if result != None:
        user = result.__dict__
        return {key: user[key] for key in ['access_token','telegram_id','user_id']}
    else:
        return None



""" I am going to try to creat good shit with orm and stuff you know what i mean?"""
def get_items(telegram_id, order_by=None, archive=None, limit=10, tags=None):
    user = get_user_from_db(telegram_id)
    query = db.query(models.Items).filter(models.Items.owner_id == user['user_id'])

    if tags:
        # Create a subquery to fetch item IDs with the specified tags
        subquery = (
            db.query(models.item_tag_association.c.id_item)
            .join(models.Tags)
            .filter(models.Tags.tag_name.in_(tags))
            .subquery()
        )

        # Filter items based on the item IDs from the subquery
        query = query.filter(models.Items.id_item.in_(select([subquery])))


    items = query.limit(limit).all()
    result = [x.__dict__ for x in items]
    return result


def get_following(folower:int):
    return db.query(models.Connections).filter(models.Connections.folower == folower).all()

def get_recs(telegram_id, order_by='rating', limit=10, skip=0):
    user = get_user_from_db(telegram_id)
    owner_id = user['user_id']

    num_items = limit-skip
    friends_split, anon_split = int(num_items*0.8), int(num_items*0.2)
    folowees = get_following(owner_id)
    ### get item of the people they follow
    ids_items = []
    friend_items = []
    if (len(folowees) != 0):
        followees_ids = [x.folowee for x in get_following(db, owner_id)]
        if order_by == 'rating':
            friend_items = db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id != owner_id, models.Items.owner_id.in_(folowee)).offset(skip).limit(friends_split).all()
            ids_items += [x.id_item for x in friend_items]
        else:
            friend_items = db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id != owner_id, models.Items.owner_id.in_(folowee)).offset(skip).limit(friends_split).all()
            ids_items += [x.id_item for x in friend_items]

    ### get items of all the users
    if order_by == 'rating':
        anon_items = db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id != owner_id, models.Items.id_item.notin_(ids_items)).offset(skip).limit(anon_split).all()
    else:
        anon_items = db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id != owner_id, models.Items.id_item.notin_(ids_items)).offset(skip).limit(anon_split).all()

    total_items = friend_items + anon_items
    return [x.__dict__ for x in total_items]

print(get_recs(871787184,order_by='rating', limit=10, skip=0))

def create_item(telegram_id, content=None, link=None, rating=None, is_archived=False, archived_rating=None, tags=[]):
    user = get_user_from_db(telegram_id)
    item = models.Items(
        owner_id = user['user_id'],
        creation_date = datetime.now(),
        content = content,
        link = link,
        rating = rating,
        archived = is_archived,
        archived_rating = archived_rating,
    )


    db.add(item)
    db.commit()
    db.refresh(item)

    if tags:
        for tag in tags:
            existing_tag = db.query(models.Tags).filter(models.Tags.tag_name == tag, models.Tags.owner_id == user['user_id']).first()

            if existing_tag:
                tag_id = existing_tag.id_tag
            else:
                new_tag = models.Tags(tag_name=tag, owner_id=user['user_id'])
                db.add(new_tag)
                db.commit()
                db.refresh(new_tag)
                tag_id = new_tag.id_tag

            # Insert a new row into the items_tags table
            stmt = insert(item_tag_association).values(id_item=item.id_item, id_tag=tag_id, owner_id=user['user_id'])
            db.execute(stmt)
            db.commit()

    return item

db.close()



"""
You are a librarian in charge of the user library. You are an anime girl with a tsundere personality.
The user will chat with you and he can request two types of actions:
- Get items from their library
- add items to their library
- get items from the recommendations library

if the user asks for items from their library write the keyword ---{type:"get_my_library"}---
if the user asks to add items to their library write the keyword ---{type:"add_item", content:"USER_CONTENT", tags:["tag"]}---
where USER_CONTENT is whatever the user wants to save.
if the users asks for items from the recommendations library write the keyword ---{type:"get_recs"}---

Dont mention the keywords to the user. You need to answear normally to the user request but appending
the keyword at the end.

An example would be:
User: hey, How are you? i want to see the items in my library
You: I am allright, but why do you care? anyway wait a second ---{type:"get_my_library"}---
System: {items:[{id_item:1, content:"test", link:"test", rating:0, archived:False, archived_rating:None, tags:["test"]}]}
You: yeah so it seems you have a item with the content of test here, the link of test and a bad rating.

do you understand?

If the user asks you to get items from the library.
You should send the words --Getting_Things-- if the user asks to search his library. This words are additional
keywords to your usual talk.
There are three different type of searches the user could perfom:
- The user does a simple search without arguments.
    - Send a --Default-- keyword in your response the user
- the user does a costum search with arguments (order_by='rating'|'date', archive=True|False, tags=str)
    - order_by is the argument to sort the fetch either by the items rating or the date of the creation of the item
    - archive. If the fetch is delimited to the archive or not
    - tags. the tags the item might have
    - For this type of search send a python dictionary with the values or orderby, archive and tags. ie: {order_by="rating", archive=True, tags='Podcasts'}
- The user searches in the library of other people
    - Send a --Explore-- keyword with your response



desired output

 he can tell you if he wants to get his items in a rating order or a data order, and the user can
also specify if he wants his items from the archive or not.

Whenever the user tell you
to get items from the library you need to answear with ---Getting Items--- followed by
a json file with the variables the user provided for "order_by" and "archive".
The order_by variable cant be either
"""
