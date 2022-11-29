from sqlalchemy.orm import Session

import json
import models, schemas


def get_user(db: Session, user_id: str):
   return db.query(models.User).filter(models.User.email == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_password(db:Session, email:str):
    user = db.query(models.User).filter(models.User.email == email).first()
    return user

def create_user(db: Session, user: schemas.UserCreate, hashed_pw:str):
    hashed_password = hashed_pw
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_type_items(db: Session, archived:int, tipo: str, owner_id:str, skip: int = 0, limit: int = 100):
    if archived:
        return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.archived == 1, models.Item.tipo == tipo, models.Item.owner_id == owner_id).offset(skip).limit(limit).all()
    else:
        return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.archived == 0, models.Item.tipo == tipo, models.Item.owner_id == owner_id).offset(skip).limit(limit).all()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, id: int, tipo: str):
    db.query(models.Item).filter(models.Item.id == id, models.Item.tipo == tipo).delete()
    db.commit()
    return True

## testing. this is a better way to setting up item getting than the main one
def get_user_items_test(db: Session):
    #return db.query(models.User).limit(1))
    return [x.items for x in db.query(models.User).limit(1)]

## Getting all the categories form an user
def get_cats_user(db: Session, usuario:str):
    cat_objs = db.query(models.Categories).order_by(models.Categories.num_items.desc()).filter(models.Categories.owner_id == usuario).all()
    return [x.category_name for x in cat_objs]
    # cat_objs = [x.categorias for x in db.query(models.User).filter(models.User.email == usuario).limit(1).all()]
    # return [x.category_name for x in cat_objs[0]]

## searching for a category in general
def search_category(db: Session, category:str, empty:int, skip:str):
    if empty == 1:
        return db.query(models.Categories).filter(models.Categories.category_name == category).all()
    else:
        return db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.num_items > 0, models.Categories.owner_id != skip).all()
    
## create categories for an user
def create_cat(db: Session, cat:str | list[str], usuario:str):
    ## hack for posting a lot at the same time
    if len(cat) >= 3 and cat[0:3] == '666':
        cat = cat[3:]
        cat_cleaned = cat.split(' ')
        lista_categories = []
        for x in cat_cleaned:
            db_cat = models.Categories(category_name=x, owner_id=usuario)
            db.add(db_cat)
            db.commit()
            db.refresh(db_cat)
            lista_categories.append(db_cat)
        return lista_categories
    else:
        db_cat = models.Categories(category_name=cat, owner_id=usuario)
        db.add(db_cat)
        db.commit()
        db.refresh(db_cat)
        return db_cat

### delete category
def delete_category(db: Session, name_category:str, usuario:str):
    db.query(models.Categories).filter(models.Categories.category_name == name_category, models.Categories.owner_id == usuario).delete()
    db.commit()
    return True

######## multiplayer things ########
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
def get_following(db: Session, folower:str):
    return db.query(models.Connections).filter(models.Connections.folower == folower).all()

## Get all the users that are following an user
def get_followers(db: Session, folowee:str):
    return db.query(models.Connections).filter(models.Connections.folowee == folowee).all()


def get_items_by_cat(user:str, category:str, db: Session):
    return db.query(models.Item).filter(models.Item.tipo == category, models.Item.owner_id == user).all()

### categories number of items
def add_num_categories(db: Session, user:str, category:str, add_or_subs:str):
    if add_or_subs == 'add':
        cat_element = db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.owner_id == user)
        cat_element.update({models.Categories.num_items: models.Categories.num_items + 1})
        db.commit()
        return {'added': True}
    elif add_or_subs == 'subs':
        cat_element = db.query(models.Categories).filter(models.Categories.category_name == category, models.Categories.owner_id == user)
        cat_element.update({models.Categories.num_items: models.Categories.num_items - 1})
        db.commit()
        return {'substracted': True}
    else:
        return {'false': 'you need to specify if you want to add or substract form category'}

def update_item(db: Session, item: schemas.ItemBase):
    object = db.query(models.Item).filter(models.Item.id == item.id, models.Item.tipo == item.tipo)
    objeto2 = object.update(item.dict())
    db.commit()
    db.refresh(objeto2)
    return True


def check_connection(db: Session, folower:str, folowee:str):
    result = db.query(models.Connections).filter(models.Connections.folower == folower, models.Connections.folowee == folowee).all()
    if result:
        return {'connected': True, 'connection': result}
    else:
        return {'connected': False}

def check_link_db(db: Session, link:str):
    result = db.query(models.Item).filter(models.Item.link == link).all()
    if result:
        return { 'is_in_db' : True }
    else:
        return { 'is_in_db' : False }

def archive_item_by_link(db: Session, link:str, username:str):
    object = db.query(models.Item).filter(models.Item.link == link, models.Item.owner_id == username)
    ## transform object into dictionary
    objeto1 = object[0]
    object_dicto = objeto1.__dict__
    object_dicto["archived"] = 1
    objeto3 = object.update(object_dicto)
    db.commit()
    db.refresh(objeto3)

    return {'archived': True}
