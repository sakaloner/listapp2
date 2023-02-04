import crud, models, schemas
from database import SessionLocal, Meta, engine
import random

db = SessionLocal()

tags = '''hola perro vaca comprar yt hoy nunca hay nada que hacer aqui en esta
        casa solo estoy aqui haciendo un codigo muy chingon para una app que 
        me hara salir de pobreza y me dara una vida de lujo y riqueza 
        a mi hermano diego lo matara'''

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
    for i in range(10):
        user = models.Items(
            id_item = i,
            content = f'content{i}',
            link = f'link{i}',
            creation_date = '2021-01-01',
            rating = random.randint(1,100),
            archived = False,
            archived_rating = None,
            owner_id = i,
        )
        db.add(user)
        db.commit()
    print('Items created')

def create_tags():
    tags_proccessed = tags.split()
    for i in range(len(tags_proccessed)):
        user = models.Tags(
            id_tag = i,
            tag_name = random.choice(tags_proccessed),
            owner_id = random.randint(0,9),
            creation_date = '2021-01-01',
            private = False,
            num_items = random.randint(1,50),
        )
        db.add(user)
        db.commit()
    print('tags created')

def create_item_tags():
    for i in range(40):
        user = models.ItemTags(
            id_item_tag = i,
            id_item = random.randint(0,9),
            id_tag = random.randint(0,19),
            owner_id = random.randint(0,9),
        )
        db.add(user)
        db.commit()
    print('item_tags created')


def create_all():
    models.Base.metadata.create_all(bind=engine)
    create_users()
    create_items()
    create_tags()
    create_item_tags()

delete_table()
create_all()



