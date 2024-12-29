import UserModel from "./models/users.model.js"

class UserDao {
    async findByID(id) {
        return await UserModel.findById(id);
    }

    async findOne(query) {
        return await UserModel.findOne(query);
    }

    async save(userData) {
        const user = new UserModel(userData);
        return await user.save();
    }
}

export default new UserDao();