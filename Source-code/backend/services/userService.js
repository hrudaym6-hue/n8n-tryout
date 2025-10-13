const bcrypt = require('bcrypt');
const { users } = require('../database/memoryStore');

class UserService {
    async getUsers(filters = {}, page = 1, limit = 10) {
        let allUsers = Array.from(users.values());

        if (filters.userType) {
            allUsers = allUsers.filter(u => u.user_type === filters.userType);
        }

        allUsers.sort((a, b) => a.user_id.localeCompare(b.user_id));

        const offset = (page - 1) * limit;
        const paginatedUsers = allUsers.slice(offset, offset + limit);

        const sanitizedUsers = paginatedUsers.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return {
            users: sanitizedUsers,
            total: allUsers.length,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    }

    async getUserById(userId) {
        const user = users.get(userId);
        if (!user) {
            return null;
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async createUser(userData) {
        const { userId, firstName, lastName, password, userType } = userData;

        if (users.has(userId)) {
            throw new Error('User ID already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            password: hashedPassword,
            user_type: userType || 'U',
            created_at: new Date(),
            updated_at: new Date()
        };

        users.set(userId, newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async updateUser(userId, updateData) {
        const user = users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const allowedFields = ['first_name', 'last_name', 'user_type'];

        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                user[field] = updateData[field];
            }
        }

        if (updateData.password) {
            user.password = await bcrypt.hash(updateData.password, 10);
        }

        user.updated_at = new Date();
        users.set(userId, user);

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async deleteUser(userId) {
        const user = users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        users.delete(userId);
        return { message: 'User deleted successfully' };
    }
}

module.exports = new UserService();
