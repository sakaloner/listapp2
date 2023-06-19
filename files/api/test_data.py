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
items_len = 70


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

def create_things():
    count_items = 500
    for i in range(100):
        rand_owner_id = random.randint(0,9)
        #create one tag
        user = models.Tags(
            id_tag = i+500,
            tag_name = random.choice(tags_proccessed),
            owner_id = rand_owner_id,
            creation_date = datetime.now(),
            private = False,
            num_items = 0,
        )
        db.add(user)
        db.commit()
        print('tag created')
        # for every tag i create 5 to 10 items with that tga
        # and the same owner id
        for j in range(random.randint(5,10)):
            item = models.Items(
                id_item = count_items,
                content = (random.choice(tags_proccessed))*(random.randint(1,10)),
                link = f'link{i}',
                creation_date = datetime.now(),
                rating = random.randint(1,100),
                archived = False,
                archived_rating = None,
                owner_id = rand_owner_id,
            )
            db.add(item)
            db.commit()
            print('items created')
            ## create the item_tags
            itemTag = models.ItemTags(
                id_item = count_items,
                id_tag = i+500,
                owner_id = rand_owner_id,
            )
            db.add(itemTag)
            db.commit()
            db.add(itemTag)
            stmt = (update(models.Tags)
                        .where(models.Tags.id_tag == i+500)
                        .values(num_items = models.Tags.num_items + 1)
                        .execution_options(synchronize_session="fetch")
            )
            db.execute(stmt)
            db.commit()
            print('item_tag created')
            count_items += 1

def create_all():
    models.Base.metadata.create_all(bind=engine)
    create_users()
    #create_things()

delete_table()
create_all()



