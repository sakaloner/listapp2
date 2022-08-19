from sqlalchemy.orm import Session

import models, schemas


def get_user(db: Session, user_id: int):
   return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_type_items(db: Session, tipo: str, skip: int = 0, limit: int = 100):
    return db.query(models.Item).order_by(models.Item.rating.desc()).filter(models.Item.tipo == tipo).offset(skip).limit(limit).all()

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


