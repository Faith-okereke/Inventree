import { Request, Response } from "express"
import { hashPassword } from "../utils/password"
import {
    getAllUsersService,
    getUserByIdService,
    getUserByEmailService,
    createUserService,
    updateUserService,
    deleteUserService,
} from "../services/users.service"
const paginationParams = (req: Request) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(
    Math.max(Number(req.query.pageSize) || 10, 1),
    100,
  );

  return { page, pageSize };
}
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { page, pageSize } = paginationParams(req);
        const users = await getAllUsersService(page, pageSize);
        return res.status(200).json({
            status: 200,
            data: users.data,
            pagination: users.pagination,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user = await getUserByIdService(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ status: 200, data: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body
    try {
        const existingUser = await getUserByEmailService(email)
        if (existingUser) {
            return res.status(400).json({ message: "That email is already in use." })
        }

        const hashedPassword = await hashPassword(password)
        const user = await createUserService({ name, email, password: hashedPassword, role })
        return res.status(201).json({ status: 201, data: user })
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "That email is already in use." })
        }
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const existingUser = await getUserByIdService(id)
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        if (req.body.email && req.body.email !== existingUser.email) {
            const duplicateEmail = await getUserByEmailService(req.body.email)
            if (duplicateEmail) {
                return res.status(400).json({ message: "That email is already in use." })
            }
        }

        const updatedUser = await updateUserService(id, req.body)
        return res.status(200).json({ status: 200, data: updatedUser })
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "That email is already in use." })
        }
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const existingUser = await getUserByIdService(id)
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" })
        }

        await deleteUserService(id)
        return res.status(204).send()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}
