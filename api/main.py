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

############# This is the new shit #################
@app.get("/get_items", response_model=list[schemas.Item])
def read_items(owner_id:int, order_by:str='rating', skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_user_items(db, owner_id=owner_id, order_by=order_by, skip=skip, limit=limit)
    print(items)
    return items

@app.get("/get_items_by_tag")
def read_items_by_tag(owner_id:int, tag_id:int, order_by:str='rating', skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_user_items_by_tag(db, owner_id=owner_id, tag_id=tag_id, order_by=order_by, skip=skip, limit=limit)
    return items

@app.get('/get_tags') #response_model=list[schemas.Tag]
def read_tags(owner_id:int, type:str='random', skip: int = 0, limit: int = 5, db: Session = Depends(get_db)):
    tags = crud.get_user_tags(db, owner_id=owner_id, type=type, skip=skip, limit=limit)
    return tags


@app.post('/create_item')
def create_item(item: schemas.Item, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)


if __name__ == '__main__':
    import uvicorn 
    uvicorn.run(app, port=8000, host='0.0.0.0')

