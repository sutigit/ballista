interface UserModelType {
    id: string;
    username: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface UserResponse {
    success: boolean;
    message: string;
    data: UserModelType | null;
    error: string;
}

export interface UsersResponse {
    success: boolean;
    message: string;
    data: UserModelType[];
    error: string;
}