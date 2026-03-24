from sqlalchemy.orm import Session
from app.models.profile_model import Profile
from app.db.session import SessionLocal

def get_or_create_local_user(db: Session):
    user = db.query(Profile).first()
    if not user:
        user = Profile(username="local_user")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user