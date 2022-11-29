from pydantic import BaseModel


class Connections(BaseModel):
    folower: str
    folowee: str  


class Categories(BaseModel):
    id: int  | None = None
    owner_id: str | None = None
    category_name: str | None = None
    num_items: int | None = None


    class Config:
        orm_mode = True

class ItemBase(BaseModel):
    id: int | None = None
    titulo: str | None = None
    autor: str | None = None
    link: str | None = None
    tipo: str | None = None
    rating: int | None = None
    owner_id: str | None = None
    archived: int | None = None
    archived_rating: int | None = None

    class Config:
        orm_mode = True


class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    pass

class UserBase(BaseModel):
    email: str
    name: str | None


class UserCreate(UserBase):
    password: str

class User(UserBase):
    is_active: bool
    items: list[Item] = []
    categorias: list[Categories] = []


    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password : str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
