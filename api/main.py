from re import S
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)


app = FastAPI()

# auth0 
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

### Authentication routes #######################
#### Create user
@app.post("/users")#, response_model=schemas.User | str)
def create_user(form_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=form_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(db=db, user=form_data)

##### log in
# def fake_hash_password(password):
#     return 'hashed##'+ password + '##hashed'
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    email = {"email":form_data.username}

    user_dict = crud.get_user_by_email(db=db, email=form_data.username)
    
    if not user_dict:
        raise HTTPException(status_code=999, detail="Incorrect username or password")
    # user = UserInDB(**user_dict)
    # hashed_password = fake_hash_password(form_data.password)
    # if not hashed_password == user.hashed_password:
    #     raise HTTPException(status_code=999, detail="Incorrect username or password")
    return {"access_token": user_dict.email, "token_type": "bearer"}


@app.post("/items", response_model=schemas.Item)
def create_item(
    item: schemas.ItemCreate, db: Session = Depends(get_db)
):
    return crud.create_item(db=db, item=item)


@app.get("/", response_model=list[schemas.Item])
def read_items(tipo: str = 'libros', skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_type_items(db, tipo=tipo, skip=skip, limit=limit)
    print(items)
    return items

@app.delete("/delete")
def delete_item_by_idtype(
    id: int, tipo: str, db: Session = Depends(get_db)
):
    try:
        crud.delete_item(db=db, id=id, tipo=tipo)
        return {'ok_its_gone_nigga': True}
    except:
        return {'Its_not_gone': False}





@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user