from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base



class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    # Prueba
    categorias = relationship("Categories", back_populates="owner")

    items = relationship("Item", back_populates="owner")

    def verify_password(self, password):
        return True

class Connections(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    folower = Column(String, ForeignKey("users.email"))
    folowee = Column(String, ForeignKey("users.email"))


class Categories(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String)
    owner_id = Column(String, ForeignKey("users.email"))
    ### prueba
    owner = relationship("User", back_populates="categorias")



    
class Item(Base):
    __tablename__ = "content"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String)
    autor = Column(String)
    link = Column(String)
    tipo = Column(String)
    rating = Column(Integer)
    
    owner_id = Column(String, ForeignKey("users.email"))

    owner = relationship("User", back_populates="items")


# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="items")