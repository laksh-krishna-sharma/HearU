import os
from datetime import datetime, timedelta
import jwt


JWT_SECRET = os.environ.get("JWT_SECRET", "@123#")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRE_HOURS", "24"))

BLACKLIST = set()


def _make_jti() -> str:
    import uuid
    return str(uuid.uuid4())


def create_access_token(identity: str) -> str:
    """
    Create a JWT with 'sub' and 'jti' claims and expiry.
    Returns a string token.
    """
    now = datetime.utcnow()
    exp = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    jti = _make_jti()
    payload = {
        "sub": str(identity),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
        "jti": jti,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token: str) -> dict:
    """
    Decode and verify token. Raises jwt exceptions on invalid/expired token.
    Also checks blacklist.
    """
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    jti = payload.get("jti")
    if jti in BLACKLIST:
        raise jwt.InvalidTokenError("Token revoked")
    return payload


def revoke_jti(jti: str):
    BLACKLIST.add(jti)