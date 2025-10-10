const { users } = require('../database/memoryStore');
const bcrypt = require('bcrypt');

class UserService {
    async getAllUsers(page = 1, limit = 10) {
        const allUsers = Array.from(users.values());
        const offset = (page - 1) * limit;
        const paginatedUsers = allUsers.slice(offset, offset + limit);
        
        return {
            users: paginatedUsers.map(u => ({
                user_id: u.user_id,
                first_name: u.first_name,
                last_name: u.last_name,
                user_type: u.user_type,
                created_at: u.created_at,
                updated_at: u.updated_at
            })),
            total: allUsers.length,
            page,
            limit
        };
    }

    async getUserById(userId) {
        const user = users.get(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    async createUser(userData) {
        const { userId, firstName, lastName, password, userType = 'U' } = userData;

        if (users.has(userId)) {
            throw new Error('User ID already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            password: hashedPassword,
            user_type: userType,
            created_at: new Date(),
            updated_at: new Date()
        };

        users.set(userId, newUser);

        return {
            user_id: newUser.user_id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            user_type: newUser.user_type,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at
        };
    }

    async updateUser(userId, updateData) {
        const user = users.get(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        if (updateData.firstName) {
            user.first_name = updateData.firstName;
        }

        if (updateData.lastName) {
            user.last_name = updateData.lastName;
        }

        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 10);
        }

        if (updateData.userType) {
            user.user_type = updateData.userType;
        }

        user.updated_at = new Date();
        users.set(userId, user);

        return {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_type: user.user_type,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    async deleteUser(userId) {
        if (!users.has(userId)) {
            throw new Error('User not found');
        }

        users.delete(userId);
        return { success: true, userId };
    }
}

module.exports = new UserService();
