from pydantic import BaseModel

''' This are the models for verification purposes
This is not implemented well i need to separete the models
into subparts for the different manipulations you can do with them
but for now this is a good start.
I left commented how it is done 
'''

class User(BaseModel):
    id: int | None = None
    email: str | None = None
    hashed_password: str | None = None
    is_active: bool | None = None

    class Config:
        orm_mode = True

class ItemBase(BaseModel):
    id_itmem: int | None = None
    content: str | None = None
    link: str | None = None
    creation_date: str | None = None
    rating: int | None = None
    archived: bool | None = None
    archived_rating: int | None = None
    owner_id: str | None = None

    class Config:
        orm_mode = True

class Tags(BaseModel):
    id_tag: int  | None = None
    tag_name: str | None = None
    owner_id: str | None = None
    creation_date: str | None = None
    private: bool | None = None

    class Config:
        orm_mode = True

class ItemTags(BaseModel):
    id_item_tag: int | None = None
    item: int | None = None
    tag: int | None = None
    owner_id: int | None = None


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None




# class UserBase(BaseModel):
#     email: str
#     name: str | None

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):
#     is_active: bool

#     class Config:
#         orm_mode = True

# class UserInDB(User):
#     hashed_password : str

