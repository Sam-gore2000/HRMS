from sqlalchemy.engine import RowMapping


def row_to_dict(row: RowMapping | None) -> dict | None:
    if row is None:
        return None
    data = dict(row)
    if "id" in data:
        data["_id"] = str(data["id"])
    return data


def rows_to_dicts(rows) -> list[dict]:
    return [row_to_dict(row._mapping) for row in rows]


def quote_name(name: str) -> str:
    if not name.replace("_", "").isalnum():
        raise ValueError("Invalid SQL identifier")
    return f'"{name}"'
