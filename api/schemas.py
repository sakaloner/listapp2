from pydantic import BaseModel


class ItemBase(BaseModel):
    id: int | None = None
    titulo: str | None = None
    autor: str | None = None
    link: str | None = None
    tipo: str | None = None
    rating: int | None = None
    owner_id: int | None = None

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


    class Config:
        orm_mode = True

class UserInDB(User):
    hashed_password : str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
