from pydantic import BaseModel


class ItemBase(BaseModel):
    id: int | None = None
    titulo: str | None = None
    autor: str | None = None
    link: str | None = None
    tipo: str | None = None
    rating: int | None = None

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
    id: int
    is_active: bool
    items: list[Item] = []

    class Config:
        orm_mode = True

class UserInDB(UserBase):
    hashed_password : str