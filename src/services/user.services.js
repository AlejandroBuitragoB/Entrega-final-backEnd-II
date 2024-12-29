import { create } from "express-handlebars";
import userRepository from "../repository/user.repository.js";
import UserDTO from "../dto/user.dto.js";

import { createHash, isValidPassword } from "../utils/util.js";

class UserService {
    async registerUser(userData) {
        const UserExists = await userRepository.getUserByEmail(userData.email)

        if(UserExists) throw new Error("user already exists");

        userData.password = createHash(userData.password);
        return await userRepository.createUser(userData);
    }

    async loginUser(email, password){
        const user = await userRepository.getUserByEmail(email);
        
        if(!user || !isValidPassword(password, user)) throw new Error("credentials error");
        return user;
    }

    async generateDTO(user) {
        const finalUser = new UserDTO(user);
        return finalUser;
    }
}

export default new UserService();