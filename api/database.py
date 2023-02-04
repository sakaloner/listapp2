from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.schema import MetaData


SQLALCHEMY_DATABASE_URL = "postgresql://docker:docker@localhost:5432/challenge_db"

engine = create_engine(
        SQLALCHEMY_DATABASE_URL, echo=False

)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Meta = MetaData()
Meta.reflect(bind=engine)