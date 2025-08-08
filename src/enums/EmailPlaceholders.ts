export enum EmailPlaceholders {
    NAME = '[name]',
    USERNAME = '[username]',
    DATE = '[date]',
}

export enum PlaceholderStatus {
    NOT_FOUND = 'not_found',
    FOUND_DATE_ONLY = 'found_date_only',
    FOUND_USER_PLACEHOLDERS = 'found_user_placeholders',
    FOUND_ALL = 'found_all',
}
