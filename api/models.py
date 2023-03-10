from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class Users(Base):
    __tablename__ = "users"

    id_user = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Items", back_populates="owner")

class Items(Base):
    __tablename__ = "items"

    id_item = Column(Integer, autoincrement=True, primary_key=True, index=True)
    content = Column(String)
    link = Column(String)
    creation_date = Column(DateTime(timezone=True), server_default=func.now())
    rating = Column(Integer)
    archived = Column(Boolean, default=False)
    archived_rating = Column(Integer)
    owner_id = Column(Integer, ForeignKey("users.id_user"))

    owner = relationship("Users", back_populates="items")

class Tags(Base):
    __tablename__ = "tags"

    id_tag = Column(Integer, primary_key=True, index=True)
    tag_name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id_user"))
    creation_date = Column(DateTime(timezone=True), server_default=func.now())
    private = Column(Boolean)
    num_items = Column(Integer)


class ItemTags(Base):
    __tablename__ = "items_tags"

    id_item_tag = Column(Integer, primary_key=True, index=True)
    id_item = Column(Integer, ForeignKey("items.id_item"))
    id_tag = Column(Integer, ForeignKey("tags.id_tag"))
    owner_id = Column(Integer, ForeignKey("users.id_user"))



class Connections(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    folowee = Column(Integer, ForeignKey("users.id_user"))
    folower = Column(Integer, ForeignKey("users.id_user"))

class TelegramUsers(Base):
    __tablename__ = "telegram_users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True)
    access_token = Column(String)
    user_id = Column(Integer, ForeignKey("users.id_user"))