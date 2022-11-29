from re import S
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import logging
import json

# Needed for running locally



            
logging.info('asdfasdfsadf')

#### info for security
SECRET_KEY = 'a5a52d2b4642d9bf9bffe27ca4c59d7da55098e05374281db838055569ab3136'
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120


import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)


app = FastAPI()

# auth0 ands passlib context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

## cors
origins = [
    "*",
    "https://localhost*",
    "http://localhost:*",
    "http://localhost*",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_password_hash(password):
    return pwd_context.hash(password)

############# final authentication shit ###############
### You should move this to another place bro. I swear
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# token = create_access_token(data = {'username': 'perro'})
# print('#######')
# payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
# print(payload)
# ################

@app.get("/test")
def read_items(username:str, db:Session=Depends(get_db)):
    return crud.get_user_by_email(db=db, email=username)
### Authentication routes #######################

def fake_decode_token(token, db):
    user = crud.get_user_by_email(db=db, email=token)
    return user

def get_user(db, username:str):
    user = crud.get_user_by_email(db=db, email=username)
    if user:
        return user
    else:
        raise HTTPException(
            status_code=407,
            detail='Couldnt find user in db'
            )

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    hash_pw = user.hashed_password
    if not verify_password(password, user.hashed_password):
        return False
    return user

### some shit
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_current_user(token: str = Depends(oauth2_scheme), db:str = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db=db, email=token_data.username)
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@app.get("/users/me")
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

#### Create user
@app.post("/users")#, response_model=schemas.User | str)
def create_user(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hp = get_password_hash(form_data.password)
    user = crud.create_user(db=db, user=form_data, hashed_pw = hp)
    ### create default categories
    crud.create_cat(db=db, cat='666pending books videos podcasts articles', usuario=form_data.email)

    return user

### Login    
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # email = {"email":form_data.username}

    # user_dict = crud.get_user_by_email(db=db, email=form_data.username)

    # if not user_dict:
    #     raise HTTPException(status_code=404, detail="Incorrect username")
    # # user = UserInDB(**user_dict)
    # hashed_password = fake_hash_password(form_data.password)
    # if not hashed_password == user_dict.hashed_password:
    #     raise HTTPException(status_code=404, detail="Incorrect password")
    # return {"access_token": user_dict.email, "token_type": "bearer"}
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}



@app.post("/items", response_model=schemas.Item)
def create_item(
    item: schemas.ItemCreate, db: Session = Depends(get_db)
):

    new_item = crud.create_item(db=db, item=item)
    crud.add_num_categories(user=item.owner_id, category=item.tipo, add_or_subs=
    'add', db=db)
    print(item)
    return new_item


@app.get("/", response_model=list[schemas.Item])
def read_items(owner_id:str, token: str = Depends(oauth2_scheme),tipo: str = 'libros', skip: int = 0, archived:int=0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_type_items(db, tipo=tipo, owner_id=owner_id, skip=skip, limit=limit, archived=archived)
    print(items)
    return items

@app.delete("/delete")
def delete_item_by_idtype(
    id: int, tipo: str, usuario:str, db: Session = Depends(get_db)
):
    try:
        crud.add_num_categories(user=usuario, category=tipo, add_or_subs='subs', db=db)
        crud.delete_item(db=db, id=id, tipo=tipo)
        return {'ok_its_gone_nigga': True}
    except:
        return {'Its_not_gone': False}



@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

## tests getting all the items of a user better way
@app.get("/testing")
def get_test(db: Session = Depends(get_db)):
    print(crud.get_user_items_test(db))
    return crud.get_user_items_test(db)

@app.get("/get_categories/{usuario}")
def get_categories(usuario:str, db: Session = Depends(get_db)):
    cats_raw = crud.get_cats_user(db, usuario)
    return cats_raw

## crear categorias para usuarios
@app.post("/cat_creation", response_model=schemas.Categories | list[schemas.Categories])#, response_model=schemas.User | str)
def create_cat_for_user(owner_id:str, category_name:str, db: Session = Depends(get_db)):
    # if db_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")
    new_cat = crud.create_cat(db=db, cat=category_name, usuario=owner_id)
    return new_cat

## elimiar categorias
@app.delete("/delete_cat")
def delete_category_post(name_category:str, usuario: str, db: Session = Depends(get_db)):
    try:
        crud.delete_category(db=db, usuario=usuario, name_category=name_category)
        return {'ok_this_category_is_gone_bro': True}
    except:
        return {'Its_not_gone': False}


######## Multiplayer things ########
@app.post("/multiplayer/follow")
def follow_user(folower:str, folowee:str, db: Session = Depends(get_db)):
    connection = crud.follow_user(db, folower=folower, folowee=folowee)
    return connection

@app.delete("/multiplayer/unfollow")
def unfollow_user(folower:str, folowee:str, db: Session = Depends(get_db)):
    if crud.unfollow_user(db, folower=folower, folowee=folowee):
        return {'ok_this_connection_is_gone': True}
    else:
        return {'something went wrong my g': False}

@app.get("/multiplayer/view_following")
def get_following(folower:str, db: Session = Depends(get_db)):
    following = crud.get_following(db, folower=folower)
    return following

@app.get("/multiplayer/view_followers")
def get_followers(folowee:str, db: Session = Depends(get_db)):
    followers = crud.get_followers(db, folowee=folowee)
    return followers

@app.get("/search_category")
def search_category_general(skip:str | None, category:str, empty:int=1, db: Session = Depends(get_db)):
    searched = crud.search_category(category=category, empty=empty, skip=skip, db=db)
    if searched:
        return searched
    else:
        return {'no_results': True}

@app.get("/get_items_by_category")
def get_items_by_cat_user(user:str, category:str, db: Session = Depends(get_db)):
    return crud.get_items_by_cat(user, category, db)

@app.post("/add_sub_category")
def add_sub_category(user:str, category:str, add_or_sub:str, db: Session = Depends(get_db)):
    return crud.add_num_categories(db, user, category, add_or_sub)

@app.put("/update_item")
def update_item(item: schemas.ItemBase, db: Session = Depends(get_db)):
    try: 
        crud.update_item(db, item)
        return {'ok': True}
    except:
        return {'ok': False}
    
@app.get("/is_following")
def is_following(folower:str, folowee:str, db: Session = Depends(get_db)):
    return crud.check_connection(db, folower, folowee)

@app.get("/link_in_db")
def is_in_db(link:str, db: Session = Depends(get_db)):
    return crud.check_link_db(db, link)

@app.get("/archive_item_by_link")
def archive_item_by_link(link:str, db: Session = Depends(get_db)):
    return crud.archive_item_by_link(db, link)

if __name__ == '__main__':
    import uvicorn
    #uvicorn.run(app, port=8000, host='172.31.80.46')    
    uvicorn.run(app, port=8000, host='0.0.0.0')

