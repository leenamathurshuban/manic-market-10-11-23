export class Account {

}

export class LoginModel {

    Username: string;
    Password: string;
}

export class SignUpPostModel {
    Email: string;
    Username: string;
    Password: string;
    ConfirmPassword: string;
    Last_name: string;
    First_name: string;
    image?: any;
}

export class UserViewModel {

    id: number;
    last_login: Date;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    is_email: boolean;
    key?: any;
    login_ip?: any;
    image?: any;
    updated_at: Date;
    groups: any[];
    user_permissions: any[];
    token: string;
}


