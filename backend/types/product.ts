export type ProductRequest = {
    // id:number,
    name: string,
    description: string,
    price: number,
    quantityInStock?: number,
    image: string,
    sku: string,
    supplierEmail?: string | null,
    lowStockThreshold?: number,
    lowStockAlertSentAt?: Date | string | null,
}