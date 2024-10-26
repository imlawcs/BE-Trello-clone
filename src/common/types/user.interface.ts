interface IUserToCreate {
    username: string;
    email: string;
    password: string;
    fullName: string;
}

interface IUserToGet {
    id: number;
    username: string;
    email: string;
    fullName: string;
}

interface IUserToUpdate {
    username?: string;
    email?: string;
    password?: string; 
    fullName?: string; 
}

export {
    IUserToCreate,
    IUserToGet,
    IUserToUpdate
};

