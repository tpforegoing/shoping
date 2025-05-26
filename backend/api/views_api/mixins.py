from datetime import datetime

from api.models.roles import CLIENT

def parse_date(value):
    try:
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None

class QueryFilterMixin:
    def apply_filters(self, qs):
        user = self.request.user
        params = self.request.query_params

        raw_filters = {
            'is_active': params.get('is_active'),
            'valid_from__gte': parse_date(params.get('valid_from_after')),
            'valid_from__lte': parse_date(params.get('valid_from_before')),
            'valid_to__gte': parse_date(params.get('valid_to_after')),
            'valid_to__lte': parse_date(params.get('valid_to_before')),
        }

        filters = {k: v for k, v in raw_filters.items() if v is not None}
        # print("filters:", filters)
        if 'is_active' in filters  and isinstance(filters['is_active'], str):
            filters['is_active'] = filters['is_active'].lower() == 'true'

        if user.role == CLIENT:
            filters['is_active'] = True

        return qs.filter(**filters)
