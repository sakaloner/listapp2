from pydantic import BaseModel


class ItemBase(BaseModel):
    titulo: str
    autor: str | None = None
    link: str | None = None
    tipo: str
    rating: int

    class Config:
        orm_mode = True



class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    pass



# class UserBase(BaseModel):
#     email: str


# class UserCreate(UserBase):
#     password: str


# class User(UserBase):
#     id: int
#     is_active: bool
#     items: list[Item] = []

#     class Config:
#         orm_mode = True