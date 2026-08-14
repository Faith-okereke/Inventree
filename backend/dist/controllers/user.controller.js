"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const password_1 = require("../utils/password");
const users_service_1 = require("../services/users.service");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, users_service_1.getAllUsersService)();
        return res.status(200).json({ status: 200, data: users });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await (0, users_service_1.getUserByIdService)(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ status: 200, data: user });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await (0, users_service_1.getUserByEmailService)(email);
        if (existingUser) {
            return res.status(400).json({ message: "That email is already in use." });
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await (0, users_service_1.createUserService)({ name, email, password: hashedPassword, role });
        return res.status(201).json({ status: 201, data: user });
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "That email is already in use." });
        }
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await (0, users_service_1.getUserByIdService)(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.email && req.body.email !== existingUser.email) {
            const duplicateEmail = await (0, users_service_1.getUserByEmailService)(req.body.email);
            if (duplicateEmail) {
                return res.status(400).json({ message: "That email is already in use." });
            }
        }
        const updatedUser = await (0, users_service_1.updateUserService)(id, req.body);
        return res.status(200).json({ status: 200, data: updatedUser });
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "That email is already in use." });
        }
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await (0, users_service_1.getUserByIdService)(id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        await (0, users_service_1.deleteUserService)(id);
        return res.status(204).send();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error occured" });
    }
};
exports.deleteUser = deleteUser;
