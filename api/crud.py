from sqlalchemy.orm import Session

import json
import models, schemas


def get_user(db: Session, user_id: int):
   return db.query(models.User).filter(models.User.id == user_id).first()


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


def get_type_items(db: Session, tipo: str, owner_id:str, skip: int = 0, limit: int = 100):
    return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.tipo == tipo, models.Item.owner_id == owner_id).offset(skip).limit(limit).all()

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
    #return db.query(models.User).limit(1))
    cat_objs = [x.categorias for x in db.query(models.User).filter(models.User.email == usuario).limit(1).all()]
    return [x.category_name for x in cat_objs[0]]

