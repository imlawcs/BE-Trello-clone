import userRepository from "../users/user.repository";
import roleRepository from "../roles/role.repository";
import customError from "../../common/error/customError";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from "../../database/entities/user";
import { Role } from "../../database/entities/role";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'abc';

interface IUser {
    username: string;
    password: string;
    email: string;
    fullname: string;
}

class AuthService {
    async register(user: IUser): Promise<{ status: number; message: string }> {
        try {
            if (!user.username || !user.password || !user.email || !user.fullname) 
                throw new customError(400, 'No empty fields');

            const userExist : User | null = await userRepository.findByUsername(user.username);
            if (userExist) {
                throw new customError(409, 'Username already exists');
            }

            // Hash the password
            const saltRound = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRound);

            user.password = hashedPassword;

            const newUser : User = {
                username: user.username,
                password: user.password,
                email: user.email,
                fullname: user.fullname,
                roles: [],
                cards: [],
                comments: [],
                notifications: [],
                workspaces: []
            }

            await userRepository.create(newUser);
            const User : User | null = await userRepository.findByUsername(user.username);
            const role : Role | null = await roleRepository.findRoleByName('user');
            if (User && role) {
                await userRepository.assignRoleToUser(User, role);
            } else {
                throw new customError(404, 'User or role not found');
            }
            return {
                status: 201,
                message: 'Register successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    async login(user: { username: string; password: string }): Promise<{ status: number; message: string; token: string }> {
        try {
            if (!user.username || !user.password)
                throw new customError(400, 'No empty fields');

            const userExist = await userRepository.findByUsername(user.username);
            if (userExist === null) {
                throw new customError(404, 'Invalid username or password');
            }

            const passwordMatch = await bcrypt.compare(user.password, userExist.password);

            if (!passwordMatch) 
                throw new customError(400, 'Invalid username or password');
            else {
                const userId = userExist.id;
                const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });
                return {
                    status: 200,
                    message: 'Login successfully',
                    token: token
                };
            }
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;
