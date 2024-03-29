from sqlalchemy.orm import Session
from datetime import datetime
import json
import models, schemas


########## Authentication Shit ################
def create_user(db: Session, user: schemas.UserCreate, hashed_pw:str):
    hashed_password = hashed_pw
    db_user = models.Users(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.Users).filter(models.Users.email == email).first()


############# LInk in db ##########
def link_in_db(db: Session, link:str, owner_id:int):
    res = db.query(models.Items).filter(models.Items.link == link, models.Items.owner_id == owner_id).first()
    print('res, ', res)
    print('link, ', link, 'owner id', owner_id)
    return res if res else False
################## Search items #######################
def search_user_items_mainBox(db: Session, order_by:str, owner_id:int, search:str, archive:bool = False, skip: int = 0, limit: int = 100):
    if order_by == 'rating':
        return db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id == owner_id, models.Items.archived == archive).filter((models.Items.content.contains(search))|(models.Items.link.contains(search))).offset(skip).limit(limit).all()
    elif order_by == 'date':
        return db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id == owner_id, models.Items.archived == archive).filter((models.Items.content.contains(search))|(models.Items.link.contains(search))).offset(skip).limit(limit).all()

def search_user_items_categories(db: Session, order_by:str, owner_id:int, search:str, skip: int = 0, limit: int = 100):
    # type = ['random', 'rating', 'num_items]
    if order_by == 'random':
        return db.query(models.Tags).filter(models.Tags.owner_id == owner_id, models.Tags.tag_name.contains(search)).offset(skip).limit(limit).all()
    elif order_by == 'rating':
        tags = db.query(models.Tags).filter(models.Tags.owner_id == owner_id, models.Tags.tag_name.contains(search)).all()
        id_tags = [x.id_tag for x in tags]
        dict = {}
        for tag_id in id_tags:
            itemsTags = db.query(models.ItemTags).filter(models.ItemTags.id_tag == tag_id).all()
            if itemsTags:
                id_items_in_tags = [x.id_item for x in itemsTags]
                items = db.query(models.Items).filter(models.Items.id_item.in_(id_items_in_tags)).all()
                items_rating = [x.rating for x in items]
                mean_rating = (sum(items_rating)/len(items_rating))
                dict[tag_id] = mean_rating
        tag_ids_ordered =  [x[0] for x in sorted(dict.items(), key=lambda item: item[1], reverse=True)]
        final_list = []
        for tag in tag_ids_ordered:
            full_tag = db.query(models.Tags).filter(models.Tags.id_tag == tag).all()
            final_list.append(full_tag[0])
        return final_list[skip:skip+limit]
    elif order_by == 'num_items':
        tags = db.query(models.Tags).order_by(models.Tags.num_items.desc()).filter(models.Tags.owner_id == owner_id, models.Tags.tag_name.contains(search)).offset(skip).limit(limit).all() 
        return tags

########################################################
def get_user_items(db: Session, order_by:str, owner_id:int, archive:bool, skip: int = 0, limit: int = 100):
    if order_by == 'rating':
        return db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id == owner_id, models.Items.archived == archive).offset(skip).limit(limit).all()
    elif order_by == 'date':
        return db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id == owner_id, models.Items.archived == archive).offset(skip).limit(limit).all()

def get_user_items_by_tag(db: Session, order_by:str, owner_id:int, tag_id:int, skip: int = 0, limit: int = 100):
    itemsTags = db.query(models.ItemTags).filter(models.ItemTags.id_tag == tag_id).all()
    id_items_in_tags = [x.id_item for x in itemsTags]
    if not id_items_in_tags:
        return {'message': 'No items with this tag'}
    if order_by == 'rating':
        return db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.id_item.in_(id_items_in_tags), models.Items.owner_id == owner_id).offset(skip).limit(limit).all()
    elif order_by == 'date':
        return db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.id_item.in_(id_items_in_tags), models.Items.owner_id == owner_id).offset(skip).limit(limit).all()


def get_user_tags(db: Session, owner_id:int, skip: int, limit: int, type:str='random'):
    # type = ['random', 'rating', 'num_items]
    if type == 'random':
        return db.query(models.Tags).filter(models.Tags.owner_id == owner_id).offset(skip).limit(limit).all()
    elif type == 'rating':
        tags = db.query(models.Tags).filter(models.Tags.owner_id == owner_id).all()
        id_tags = [x.id_tag for x in tags]
        dict = {}
        for tag_id in id_tags:
            itemsTags = db.query(models.ItemTags).filter(models.ItemTags.id_tag == tag_id).all()
            if itemsTags:
                id_items_in_tags = [x.id_item for x in itemsTags]
                items = db.query(models.Items).filter(models.Items.id_item.in_(id_items_in_tags)).all()
                items_rating = [x.rating for x in items]
                mean_rating = (sum(items_rating)/len(items_rating))
                dict[tag_id] = mean_rating
        tag_ids_ordered =  [x[0] for x in sorted(dict.items(), key=lambda item: item[1], reverse=True)]
        final_list = []
        for tag in tag_ids_ordered:
            full_tag = db.query(models.Tags).filter(models.Tags.id_tag == tag).all()
            final_list.append(full_tag[0])
        return final_list[skip:skip+limit]
    elif type == 'num_items':
        tags = db.query(models.Tags).order_by(models.Tags.num_items.desc()).filter(models.Tags.owner_id == owner_id).offset(skip).limit(limit).all() 
        return tags

def create_tag(db: Session, tag:str, owner_id:int):
    tag_db = db.query(models.Tags).filter(models.Tags.tag_name == tag, models.Tags.owner_id == owner_id).first()
    #tag exists
    if tag_db:
        ## update the number of items in the tag
        tag_db.num_items += 1
        db.commit()
        db.refresh(tag_db)
        return tag_db
    #tag does not exist
    else:
        tag_db = models.Tags(tag_name=tag, owner_id=owner_id, private=False, num_items=1)
        db.add(tag_db)
        db.commit()
        db.refresh(tag_db)
        return tag_db

def create_itemTag(db: Session, id_item:int, id_tag:int, owner_id:int):
    item_tag = models.ItemTags(id_item=id_item, id_tag=id_tag, owner_id=owner_id)
    db.add(item_tag)
    db.commit()
    db.refresh(item_tag)
    return item_tag

def create_item(db: Session, item:schemas.CreateItem):
    item_dict = {**item.dict()}
    item_dict['creation_date'] = datetime.now()
    print('item', item)
    ## create item
    item_dict.pop('tags')

    db_item = models.Items(**item_dict)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    if item.tags:
        print('item.tags', item.tags)
        tags = item.tags
        for tag in tags:
            print('current tag', tag)
            tag_db = create_tag(db, tag, item.owner_id)
            print('created tag', tag_db)
            print('tag_db', tag_db, 'tag_db.id_tag', tag_db.id_tag, 'item.id_item', item.id_item, 'item.owner_id', item.owner_id)
            create_itemTag(db, db_item.id_item, tag_db.id_tag, item.owner_id)
    # prepare the response
    db.refresh(db_item)
    res_dict = {**db_item.__dict__}
    if item.tags:
        res_dict['tags'] = tags
    return res_dict

def get_item_tags(db: Session, item_id:int):
    itemTags = db.query(models.ItemTags).filter(models.ItemTags.id_item == item_id).all()
    id_tags_in_item = [x.id_tag for x in itemTags]
    if not id_tags_in_item:
        return []
    return db.query(models.Tags).filter(models.Tags.id_tag.in_(id_tags_in_item)).all()

def update_item(db: Session, item:schemas.UpdateItem):
    ## update item no tags
    print('#########', item)
    item_db = db.query(models.Items).filter(models.Items.id_item == item.id_item)
    item_no_tags = {**item.dict()}
    item_no_tags.pop('tags')
    item_db.update(item_no_tags)
    db.commit()
    ## update tags
    if item.tags != None:
        old_tags_db = get_item_tags(db, item.id_item)
        old_tags = [x.tag_name for x in old_tags_db]
        diff = list(set(old_tags).symmetric_difference(set(item.tags)))
        print('diff', diff)
        print('item.tags', item.tags)
        print('item_db.tags', old_tags)
        if not diff:
            return {'message': 'updated item with no tag changes'}
        for tag in diff:
            if tag in item.tags:
                print("tag is new, adding")
                ## New tag. Add to db
                tag_db = create_tag(db, tag, item.owner_id)
                create_itemTag(db, item.id_item, tag_db.id_tag, item.owner_id)
            else:
                print("tag is old. deleting")
                ## old tag gone. delete from db
                ## delete the itemTag
                tag_db = db.query(models.Tags).filter(models.Tags.tag_name == tag, models.Tags.owner_id == item.owner_id).first()
                itemTag = db.query(models.ItemTags).filter(models.ItemTags.id_item == item.id_item, models.ItemTags.id_tag == tag_db.id_tag).first()
                db.delete(itemTag)
                db.commit()
                ## delete the tag if it has 1 item
                if tag_db.num_items == 1:
                    print('deleting tag')
                    db.delete(tag_db)
                    db.commit()
                else:
                    print('substracting from tag num_item')
                    tag_db.num_items -= 1
                    db.commit()
        return {'message': 'updated item with tag changes'}
    else:
        return {'message': 'updated item, no tags'}



def delete_item(db: Session, id_item: int):
    item = db.query(models.Items).filter(models.Items.id_item == id_item)
    tags_db = get_item_tags(db, id_item)
    if tags_db:
        for tag_db in tags_db:
        # tag_db = db.query(models.Tags).filter(models.Tags.tag_name == tag, models.Tags.owner_id == item.owner_id).first()
            itemTag = db.query(models.ItemTags).filter(models.ItemTags.id_item == id_item, models.ItemTags.id_tag == tag_db.id_tag).first()
            print("deleting item tag")
            db.delete(itemTag)
            db.commit()
            ## delete the tag if it has 1 item
            if tag_db.num_items == 1:
                print('deleting tag')
                db.delete(tag_db)
                db.commit()
            else:
                print('substracting from tag num_item')
                tag_db.num_items -= 1
                db.commit()
    ## delete Item
    item.delete()
    db.commit()
    return True


######## multiplayer things ########
def get_profile_info(db: Session, user_id: int, profile_id: int):
    user = db.query(models.Users).filter(models.Users.id_user == profile_id).first()
    if(user == None):
        return {'msg': "user not found"}
    user_dict = {**user.__dict__}
    followers = db.query(models.Connections).filter(models.Connections.folowee == profile_id).all()
    following = db.query(models.Connections).filter(models.Connections.folower == profile_id).all()
    num_items = db.query(models.Items).filter(models.Items.owner_id == profile_id).count()
    res = {
        "same_user": user_id == profile_id,
        'user_id': user_id,
        'profile_id': profile_id,
        "user_email": user_dict['email'],
        "num_followers": len(followers),
        "num_following": len(following),
        'user_is_following': any(x.folower == user_id for x in followers),
        'user_is_followed': any(x.folowee == user_id for x in following),
        'num_items': num_items
    }
    return res

def get_my_profile(db:Session, current_user:schemas.User):
    user_dict = {**current_user.__dict__}
    user_id = user_dict['id_user']
    followers = db.query(models.Connections).filter(models.Connections.folowee == user_id).all()
    following = db.query(models.Connections).filter(models.Connections.folower == user_id).all()
    num_items = db.query(models.Items).filter(models.Items.owner_id == user_id).count()

    res = {
        "user_id": user_dict['id_user'],
        "user_email": user_dict['email'],
        "num_followers": len(followers),
        "num_following": len(following),
        'num_items': num_items
    }
    return res

def follow_user(db: Session, folower:str, folowee:str):
    db_follow = models.Connections(folower=folower, folowee=folowee)
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)
    return db_follow

## Stop following an user
def unfollow_user(db: Session, folower:str, folowee:str):
    db.query(models.Connections).filter(models.Connections.folower == folower, models.Connections.folowee == folowee).delete()
    db.commit()
    return True

## Get all the users that an user is following
def get_following(db: Session, folower:int):
    return db.query(models.Connections).filter(models.Connections.folower == folower).all()

## Get all the users that are following an user
def get_followers(db: Session, folowee:int):
    return db.query(models.Connections).filter(models.Connections.folowee == folowee).all()


################ recommenation function ###########
def get_recs(db:Session, order_by:str, owner_id:int, skip: int = 0, limit: int = 50):
    """
    This function gets a list of recommended items for an user
    Arguments:
    - user_id: id of the user
    - type:str main View or category View
    - orderBy
        -  the box view you can choose from rating to date
        - the category view will be ordered normally. This argument will not affect it
    - db: database connection
    - skip
    - limit
    """
    # get followees accounts
    num_items = limit-skip
    friends_split, anon_split = int(num_items*0.8), int(num_items*0.2)
    print('split!!!!!!!!!11', friends_split, anon_split)
    followees = get_following(db, owner_id)
    print(followees)
    ### get item of the people they follow
    ids_items = []
    friend_items = []
    if (len(followees) != 0):
        followees_ids = [x.folowee for x in get_following(db, owner_id)]
        print(followees_ids)
        if order_by == 'rating':
            friend_items = db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id != owner_id, models.Items.owner_id.in_(followees_ids)).offset(skip).limit(friends_split).all()
            ids_items += [x.id_item for x in friend_items]
        else:
            friend_items = db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id != owner_id, models.Items.owner_id.in_(followees_ids)).offset(skip).limit(friends_split).all()
            ids_items += [x.id_item for x in friend_items]
    
    ### get items of all the users
    if order_by == 'rating':
        anon_items = db.query(models.Items).order_by(models.Items.rating.desc()).filter(models.Items.owner_id != owner_id, models.Items.id_item.notin_(ids_items)).offset(skip).limit(anon_split).all()
    else:
        anon_items = db.query(models.Items).order_by(models.Items.creation_date.desc()).filter(models.Items.owner_id != owner_id, models.Items.id_item.notin_(ids_items)).offset(skip).limit(anon_split).all()

    total_items = friend_items + anon_items
    return total_items


def search_all_items(db: Session, order_by:str, search:str, skip: int = 0, limit: int = 100):
    if order_by == 'rating':
        return db.query(models.Items).order_by(models.Items.rating.desc()).filter((models.Items.content.contains(search))|(models.Items.link.contains(search))).offset(skip).limit(limit).all()
    elif order_by == 'date':
        return db.query(models.Items).order_by(models.Items.creation_date.desc()).filter((models.Items.content.contains(search))|(models.Items.link.contains(search))).offset(skip).limit(limit).all()


########### Telegram Bot ############
def login_telegram(db: Session, user_id:int, client_id:int, access_token:str):
    telegram_obj = models.TelegramUsers(user_id=user_id, telegram_id=client_id, access_token=access_token)
    db.add(telegram_obj)
    db.commit()
    db.refresh(telegram_obj)
    return telegram_obj

def get_telegram_user_token(db: Session, telegram_id:int):
    return db.query(models.TelegramUsers).filter(models.TelegramUsers.telegram_id == telegram_id).first()




# def get_user(db: Session, user_id: str):
#    return db.query(models.User).filter(models.User.email == user_id).first()


# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()


# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.User).offset(skip).limit(limit).all()

# def get_password(db:Session, email:str):
#     user = db.query(models.User).filter(models.User.email == email).first()
#     return user

# def create_user(db: Session, user: schemas.UserCreate, hashed_pw:str):
#     hashed_password = hashed_pw
#     db_user = models.User(email=user.email, hashed_password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# def get_type_items(db: Session, archived:int, tipo: str, owner_id:str, skip: int = 0, limit: int = 100):
#     if archived:
#         return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.archived == 1, models.Item.tipo == tipo, models.Item.owner_id == owner_id).offset(skip).limit(limit).all()
#     else:
#         return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.archived == 0, models.Item.tipo == tipo, models.Item.owner_id == owner_id).offset(skip).limit(limit).all()

# def create_item(db: Session, item: schemas.ItemCreate):
#     db_item = models.Item(**item.dict())
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item

# def delete_item(db: Session, id: int, tipo: str):
#     db.query(models.Item).filter(models.Item.id == id, models.Item.tipo == tipo).delete()
#     db.commit()
#     return True

# ## testing. this is a better way to setting up item getting than the main one
# def get_user_items_test(db: Session):
#     #return db.query(models.User).limit(1))
#     return [x.items for x in db.query(models.User).limit(1)]

# ## Getting all the categories form an user
# def get_cats_user(db: Session, usuario:str):
#     cat_objs = db.query(models.Categories).order_by(models.Categories.num_items.desc()).filter(models.Categories.owner_id == usuario).all()
#     return [x.category_name for x in cat_objs]
#     # cat_objs = [x.categorias for x in db.query(models.User).filter(models.User.email == usuario).limit(1).all()]
#     # return [x.category_name for x in cat_objs[0]]

# ## searching for a category in general
# def search_category(db: Session, category:str, empty:int, skip:str):
#     if empty == 1:
#         return db.query(models.Categories).filter(models.Categories.category_name == category).all()
#     else:
#         return db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.num_items > 0, models.Categories.owner_id != skip).all()
    
# ## create categories for an user
# def create_cat(db: Session, cat:str | list[str], usuario:str):
#     ## hack for posting a lot at the same time
#     if len(cat) >= 3 and cat[0:3] == '666':
#         cat = cat[3:]
#         cat_cleaned = cat.split(' ')
#         lista_categories = []
#         for x in cat_cleaned:
#             db_cat = models.Categories(category_name=x, owner_id=usuario)
#             db.add(db_cat)
#             db.commit()
#             db.refresh(db_cat)
#             lista_categories.append(db_cat)
#         return lista_categories
#     else:
#         db_cat = models.Categories(category_name=cat, owner_id=usuario)
#         db.add(db_cat)
#         db.commit()
#         db.refresh(db_cat)
#         return db_cat

# ### delete category
# def delete_category(db: Session, name_category:str, usuario:str):
#     db.query(models.Categories).filter(models.Categories.category_name == name_category, models.Categories.owner_id == usuario).delete()
#     db.commit()
#     return True


# def get_items_by_cat(user:str, category:str, db: Session):
#     return db.query(models.Item).filter(models.Item.tipo == category, models.Item.owner_id == user).all()

# ### categories number of items
# def add_num_categories(db: Session, user:str, category:str, add_or_subs:str):
#     if add_or_subs == 'add':
#         cat_element = db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.owner_id == user)
#         cat_element.update({models.Categories.num_items: models.Categories.num_items + 1})
#         db.commit()
#         return {'added': True}
#     elif add_or_subs == 'subs':
#         cat_element = db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.owner_id == user)
#         cat_element.update({models.Categories.num_items: models.Categories.num_items - 1})
#         db.commit()
#         return {'substracted': True}
#     else:
#         return {'false': 'you need to specify if you want to add or substract form category'}

# def update_item(db: Session, item: schemas.ItemBase):
#     object = db.query(models.Item).filter(models.Item.id == item.id, models.Item.tipo == item.tipo)
#     objeto2 = object.update(item.dict())
#     db.commit()
#     db.refresh(objeto2)
#     return True


# def check_connection(db: Session, folower:str, folowee:str):
#     result = db.query(models.Connections).filter(models.Connections.folower == folower, models.Connections.folowee == folowee).all()
#     if result:
#         return {'connected': True, 'connection': result}
#     else:
#         return {'connected': False}

# def check_link_db(db: Session, link:str):
#     result = db.query(models.Item).filter(models.Item.link == link).all()
#     if result:
#         return { 'is_in_db' : True }
#     else:
#         return { 'is_in_db' : False }

# def archive_item_by_link(db: Session, link:str, username:str, slider_value:int):
#     thinga = db.query(models.Item).filter(models.Item.link == link, models.Item.owner_id == username)
#     thinga.update({models.Item.archived: 1, models.Item.archived_rating: slider_value})
#     db.commit()
#     return {'archived': True}

