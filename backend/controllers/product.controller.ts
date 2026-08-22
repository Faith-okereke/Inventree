import { Request, Response } from "express"
import { getProducts, searchProducts, getProductById, getProductByName, postProducts, updateProducts, deleteProducts } from "../services/product.service"

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
        const products = await getProducts(page, pageSize);
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

    if (!query) {
        return res.status(400).json({ message: 'Search query `q` is required.' })
    }

    try {
        const products = await searchProducts(query)
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
    try {
        const product = await getProductById(productId)

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
    try {
        const existingByName = await getProductByName(req.body.name)
        if (existingByName) {
            return res.status(400).json({ message: 'A product with this name already exists.' })
        }

        const newProduct = await postProducts(req.body)
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
export const updateTheProduct = async(req: Request, res: Response) => {
        const { id: productId } = req.params

        try {
            const existingProduct = await getProductById(productId)
            if (!existingProduct) {
                return res.status(404).json({ message: "Product not found" })
            }

            if (req.body.name && req.body.name !== existingProduct.name) {
                const duplicateName = await getProductByName(req.body.name)
                if (duplicateName) {
                    return res.status(400).json({ message: 'A product with this name already exists.' })
                }
            }

            const updatedProduct = await updateProducts(productId, req.body)
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
    export const deleteTheProduct =async (req: Request, res: Response) => {
        const { id: productId } = req.params
        const existingProduct = await getProductById(productId)
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" })
        }
        await deleteProducts({ id: productId })
        return res.status(204).send()
    }