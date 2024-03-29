from re import S
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile
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
ACCESS_TOKEN_EXPIRE_MINUTES = 1000000000


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


############# final authentication shit ###############
### utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    hash_pw = user.hashed_password
    if not verify_password(password, user.hashed_password):
        return False
    return user

## main user functions
def get_user(db, username:str):
    user = crud.get_user_by_email(db=db, email=username)
    if user:
        return user
    else:
        raise HTTPException(
            status_code=407,
            detail='Couldnt find user in db'
            )

#### Create user
@app.post("/user_create")#, response_model=schemas.User | str)
def create_user(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_email = crud.get_user_by_email(db, email=form_data.email)
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    hp = get_password_hash(form_data.password)
    user = crud.create_user(db=db, user=form_data, hashed_pw = hp)
    return user

### Login    
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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
    print('client id!!!!!!1', form_data.client_id)
    if form_data.client_id != None:
        crud.login_telegram(db, user.id_user, form_data.client_id, access_token)
        return {"msg":"successfully logged into telegram"}

    return {"user_id":user.id_user,"access_token": access_token, "token_type": "bearer"}

## optional things
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


############# This is the new shit #################
@app.get("/get_items")#, response_model=list[schemas.Item])
def read_items(archive:bool=False, order_by:str='rating', skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_active_user) ,db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    items = crud.get_user_items(db, owner_id=owner_id, order_by=order_by, archive=archive, skip=skip, limit=limit)
    return items

@app.get("/get_items_by_tag")
def read_items_by_tag(tag_id:int, order_by:str='rating', skip: int = 0, limit: int = 100,current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    items = crud.get_user_items_by_tag(db, owner_id=owner_id, tag_id=tag_id, order_by=order_by, skip=skip, limit=limit)
    return items

@app.get('/get_tags') #response_model=list[schemas.Tag]
def read_tags(type:str='random', skip: int = 0, limit: int = 5, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    tags = crud.get_user_tags(db, owner_id=owner_id, type=type, skip=skip, limit=limit)
    return tags

@app.post('/create_item')
def create_item(item:schemas.CreateItem, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    item_fixed = item.dict()
    item_fixed['owner_id'] = owner_id
    item_fixed = schemas.CreateItem(**item_fixed)
    return crud.create_item(db=db, item=item_fixed)

@app.get('/get_item_tags')
def get_item_tags(item_id:int, db: Session = Depends(get_db)):
    return crud.get_item_tags(db=db, item_id=item_id)

@app.post('/update_item')
def update_item(item:schemas.UpdateItem, db: Session = Depends(get_db)):
    return crud.update_item(db=db, item=item)

@app.delete('/delete_item')
def delete_item(id_item:int, db: Session = Depends(get_db)):
    return crud.delete_item(db=db, id_item=id_item)

@app.get('/search_items_mainBox')
def search_user_items_main(search:str, order_by:str='rating', skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    return crud.search_user_items_mainBox(db=db, owner_id=owner_id, search=search, order_by=order_by, skip=skip, limit=limit)

@app.get('/search_user_items_categories')
def search_user_items_categories(search:str, order_by:str='rating', skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    owner_id = current_user.id_user
    return crud.search_user_items_categories(db=db, owner_id=owner_id, search=search, order_by=order_by, skip=skip, limit=limit)

@app.get('/link_in_db')
def link_in_db(link:str, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.link_in_db(db=db, link=link, owner_id=current_user.id_user)

################ Multiplayer Functions #####################
@app.get('/profile/{id_profile}')
def get_profile(id_profile:int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_profile_info(db=db, user_id=current_user.id_user, profile_id=id_profile)

@app.get('/myProfile')
def get_profile(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_my_profile(db=db, current_user=current_user)

@app.post('/follow_user')
def follow_user(folower:int, folowee:int,  db: Session = Depends(get_db)):
    return crud.follow_user(db=db, folower=folower, folowee=folowee)

@app.post('/unfollow_user')
def unfollow_user(folower:int, folowee:int,  db: Session = Depends(get_db)):
    return crud.unfollow_user(db=db, folower=folower, folowee=folowee)

###### Multiplayer recommendation function #################
@app.get('/get_recs')
def get_recoomendation(order_by:str='rating', current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.get_recs(db=db, order_by=order_by, owner_id=current_user.id_user)

@app.get('/search_all_items')
def search_all_items(search:str, order_by:str='rating', skip: int = 0, limit: int = 100, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return crud.search_all_items(db=db, search=search, order_by=order_by, skip=skip, limit=limit,)


@app.get('/get_telegram_user')
def get_telegram_user_token(telegram_id:int, db: Session = Depends(get_db)):
    return crud.get_telegram_user_token(db=db, telegram_id=telegram_id)






if __name__ == '__main__':
    import uvicorn 
    uvicorn.run(app, port=8000, host='0.0.0.0')

