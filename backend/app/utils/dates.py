from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

from app.core.config import settings


def now_ist() -> datetime:
    return datetime.now(ZoneInfo(settings.timezone))


def today_ist() -> date:
    return now_ist().date()


def attendance_cycle(today: date | None = None) -> tuple[date, date]:
    current = today or today_ist()
    if current.day >= 25:
        return current.replace(day=25), current
    previous_month = (current.replace(day=1) - timedelta(days=1)).replace(day=25)
    return previous_month, current


def working_days(start: date, end: date) -> int:
    days = 0
    current = start
    while current <= end:
        if current.weekday() < 5:
            days += 1
        current += timedelta(days=1)
    return days
