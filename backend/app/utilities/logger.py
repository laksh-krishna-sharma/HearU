import logging
import sys

from config import settings

LOG_FORMAT = "[%(asctime)s] %(levelname)s [%(name)s.%(funcName)s:%(lineno)d] %(message)s"
DATEFMT = "%d/%b/%Y %H:%M:%S"


def _level_from_string(level_str: str) -> int:
    """
    Convert a logging level name (e.g. "INFO") to the numeric level.
    Defaults to logging.INFO for unknown values.
    """
    if not level_str:
        return logging.INFO
    return getattr(logging, level_str.upper(), logging.INFO)


def logger(name: str = "HearU") -> logging.Logger:
    """
    Factory that returns a configured logger instance.

    Usage:
        from utilities.logger import logger
        log = logger(__name__)   # preferred
        # or keep the default name:
        log = logger()
    """
    lvl = _level_from_string(settings.logging_level)

    _logger = logging.getLogger(name)

    if not _logger.handlers:
        _logger.setLevel(lvl)

        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(lvl)
        handler.setFormatter(logging.Formatter(fmt=LOG_FORMAT, datefmt=DATEFMT))

        _logger.addHandler(handler)

    return _logger
