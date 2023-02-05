import crud, models, schemas
from sqlalchemy import update
from database import SessionLocal, Meta, engine
import random
from datetime import datetime

db = SessionLocal()

tags = '''hola perro vaca comprar yt hoy nunca patineta ninios
        familia escuela proyectos suenios vida startups ideas
        novias amigos deportes actividades'''
tags_proccessed = tags.split()
items_len = 1000

def delete_table(table=None):
    if table:
        db.execute(f'DELETE FROM {table}')
        db.commit()
    else:
        # for tb in Meta.tables.keys():
        for tb in ['users','tags','items','users', 'items_tags']:
            db.execute(f'DROP TABLE IF EXISTS {tb} CASCADE')
        db.commit()
        print('reseted')

def create_users():
    for i in range(10):
        user = models.Users(
            id_user = i,
            email = f'andres{i}',
            hashed_password = '12345',
            is_active = True
        )
        db.add(user)
        db.commit()
    print('Users created')

def create_items():
    for i in range(items_len):
        user = models.Items(
            id_item = i,
            content = (random.choice(tags_proccessed))*(random.randint(0,10)),
            link = f'link{i}',
            creation_date = datetime.now(),
            rating = random.randint(1,100),
            archived = False,
            archived_rating = None,
            owner_id = random.randint(0,9),
        )
        db.add(user)
        db.commit()
    print('Items created')

def create_tags():
    count = 0
    for i, tag in enumerate(tags_proccessed):
        for j in range(random.randint(2,10)):
            user = models.Tags(
                id_tag = count,
                tag_name = random.choice(tags_proccessed),
                owner_id = random.randint(0,9),
                creation_date = datetime.now(),
                private = False,
                num_items = 0,
            )
            db.add(user)
            db.commit()
            count+=1
    print('tags created')

def create_item_tags():
    count = 0
    for i in range(items_len):
        for j in range(random.randint(0,8)):
            rand_tag = random.randint(0,len(tags_proccessed)-1)
            user = models.ItemTags(
                id_item_tag = count,
                id_item = random.randint(0,items_len-1),
                id_tag = rand_tag,
                owner_id = random.randint(0,9),
            )
            db.add(user)
            stmt = (update(models.Tags)
                        .where(models.Tags.id_tag == rand_tag)
                        .values(num_items = models.Tags.num_items + 1)
                        .execution_options(synchronize_session="fetch")
            )
            db.execute(stmt)
            db.commit()
            count += 1
    print('item_tags created')


def create_all():
    models.Base.metadata.create_all(bind=engine)
    create_users()
    create_items()
    create_tags()
    create_item_tags()

delete_table()
create_all()



