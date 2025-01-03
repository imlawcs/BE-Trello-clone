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
    ASSIGN_ROLE_IN_WORKSPACE = 'assign-role-in-workspace',

    CREATE_BOARD = 'create-board',
    GET_BOARD = 'get-board',
    UPDATE_BOARD = 'update-board',
    DELETE_BOARD = 'delete-board',
    ADD_USER_TO_BOARD = 'add-user-to-board',
    REMOVE_USER_FROM_BOARD = 'remove-user-from-board',
    ASSIGN_ROLE_IN_BOARD = 'assign-role-in-board',

    CREATE_LIST = 'create-list',
    GET_LIST = 'get-list',
    UPDATE_LIST = 'update-list',
    DELETE_LIST = 'delete-list',

    CREATE_CARD = 'create-card',
    GET_CARD = 'get-card',
    UPDATE_CARD = 'update-card',
    DELETE_CARD = 'delete-card',
    MOVE_CARD = 'move-card',
    ASSIGN_USER_TO_CARD = 'assign-user-to-card',
    REMOVE_USER_FROM_CARD = 'remove-user-from-card',

    CREATE_COMMENT = 'create-comment',
    GET_COMMENT = 'get-comment',
    UPDATE_COMMENT = 'update-comment',
    DELETE_COMMENT = 'delete-comment',

    CREATE_ATTACHMENT = 'create-attachment',
    GET_ATTACHMENT = 'get-attachment',
    UPDATE_ATTACHMENT = 'update-attachment',
    DELETE_ATTACHMENT = 'delete-attachment',

    CREATE_NOTIFICATION = 'create-notification',
    GET_NOTIFICATION = 'get-notification',
    MARK_AS_READ_NOTIFICATION = 'mark-as-read-notification',
}