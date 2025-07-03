export interface IUserWithEmail {
    username: string;
    email: string;
}

export interface IUserLookupResult {
    foundUsers: IUserWithEmail[];
    notFoundUsers: string[];
    usersWithoutEmail: string[];
}
