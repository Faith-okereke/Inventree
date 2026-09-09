import { Request, Response } from "express"
import { getProducts, searchProducts, getProductById, getProductByName, postProducts, updateProducts, deleteProducts } from "../services/product.service"
import { AuthenticatedRequest } from "../middleware/require-auth.middleware";

const paginationParams = (req: Request) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const pageSize = Math.min(
        Math.max(Number(req.query.pageSize) || 10, 1),
        100,
    );

    return { page, pageSize };
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { page, pageSize } = paginationParams(req);
        const user = (req as AuthenticatedRequest).auth;
        const products = await getProducts(user!.businessId, page, pageSize);
        return res.status(200).json({
            status: 200,
            data: products.data,
            pagination: products.pagination,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}
export const searchTheProducts = async (req: Request, res: Response) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    const businessId = (req as AuthenticatedRequest).auth!.businessId;

    if (!query) {
        return res.status(400).json({ message: 'Search query `q` is required.' })
    }

    try {
        const products = await searchProducts(query, businessId)
        return res.status(200).json({
            status: 200,
            data: products
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}
export const getTheProduct = async (req: Request, res: Response) => {
    const { id: productId } = req.params
    const businessId = (req as AuthenticatedRequest).auth!.businessId;
    try {
        const product = await getProductById(productId, businessId)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        return res.status(200).json({ status: 200, data: product })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occured" })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    const businessId = (req as AuthenticatedRequest).auth!.businessId;
    try {
        const existingByName = await getProductByName(req.body.name, businessId)
        if (existingByName) {
            return res.status(400).json({ message: 'A product with this name already exists.' })
        }

        const newProduct = await postProducts(req.body, businessId)
        return res.status(201).json({ status: 201, data: newProduct })
    } catch (error: any) {
        if (error.code === 'P2002') {
            const target = error.meta?.target
            if (Array.isArray(target) && target.includes('name')) {
                return res.status(400).json({ message: 'A product with this name already exists.' })
            }
            if (Array.isArray(target) && target.includes('sku')) {
                return res.status(400).json({ message: 'A product with this SKU already exists.' })
            }
        }
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occurred" })
    }
}
export const updateTheProduct = async (req: Request, res: Response) => {
    const { id: productId } = req.params
    const businessId = (req as AuthenticatedRequest).auth!.businessId;
    try {
        const existingProduct = await getProductById(productId, businessId)
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" })
        }

        if (req.body.name && req.body.name !== existingProduct.name) {
            const duplicateName = await getProductByName(req.body.name, businessId)
            if (duplicateName) {
                return res.status(400).json({ message: 'A product with this name already exists.' })
            }
        }

        const updatedProduct = await updateProducts(productId, businessId, req.body)
        return res.status(200).json({ status: 200, data: updatedProduct })
    } catch (error: any) {
        if (error.code === 'P2002') {
            const target = error.meta?.target
            if (Array.isArray(target) && target.includes('name')) {
                return res.status(400).json({ message: 'A product with this name already exists.' })
            }
            if (Array.isArray(target) && target.includes('sku')) {
                return res.status(400).json({ message: 'A product with this SKU already exists.' })
            }
        }
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error occurred" })
    }
}
export const deleteTheProduct = async (req: Request, res: Response) => {
    const { id: productId } = req.params
    const businessId = (req as AuthenticatedRequest).auth!.businessId;
    const existingProduct = await getProductById(productId, businessId)
    if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" })
    }
    await deleteProducts({ id: productId, businessId })
    return res.status(204).send()
}