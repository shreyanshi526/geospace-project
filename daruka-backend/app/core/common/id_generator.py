import random
import string


def generate_user_id() -> str:
    """Generate a unique 6-character User ID (starts with U)."""
    chars = string.ascii_uppercase + string.digits
    return "U" + "".join(random.choices(chars, k=5))


def generate_site_id() -> str:
    """Generate unique Site ID starting with S"""
    chars = string.ascii_uppercase + string.digits
    return "S" + "".join(random.choices(chars, k=5))


def generate_site_analytics_id() -> str:
    """Generate unique Site Analytics ID starting with SA"""
    chars = string.ascii_uppercase + string.digits
    return "SA" + "".join(random.choices(chars, k=5))


def generate_project_id() -> str:
    """Generate a unique 6-character Project ID (starts with P)."""
    chars = string.ascii_uppercase + string.digits
    return "P" + "".join(random.choices(chars, k=5))
