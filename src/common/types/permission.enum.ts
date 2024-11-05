export enum Permission {
    // CREATE_USER = 'create-user',
    GET_USER = 'get-user',
    UPDATE_USER = 'update-user',
    DELETE_USER = 'delete-user',
    ASSIGN_ROLE = 'assign-role',
    REMOVE_ROLE = 'remove-role',

    CREATE_ROLE = 'create-role',
    GET_ROLE = 'get-role',
    UPDATE_ROLE = 'update-role',
    DELETE_ROLE = 'delete-role',
    ASSIGN_PERMISSION = 'assign-permission',
    DELETE_PERMISSION_FROM_ROLE = 'delete-permission-from-role',

    CREATE_PERMISSION = 'create-permission',
    GET_PERMISSION = 'get-permission',
    UPDATE_PERMISSION = 'update-permission',
    DELETE_PERMISSION = 'delete-permission',

    CREATE_WORKSPACE = 'create-workspace',
    GET_WORKSPACE = 'get-workspace',
    UPDATE_WORKSPACE = 'update-workspace',
    DELETE_WORKSPACE = 'delete-workspace',
    ADD_USER_TO_WORKSPACE = 'add-user-to-workspace',
    REMOVE_USER_FROM_WORKSPACE = 'remove-user-from-workspace',
}