import { sendEmail } from "../services/email.service"

type LowStockAlertProduct = {
    name: string
    sku: string
    quantityInStock: number
    lowStockThreshold: number | null
    supplierEmail: string | null
}

export const sendLowStockAlertEmail = async (product: LowStockAlertProduct) => {
    if (!product.supplierEmail) return false

    const threshold = product.lowStockThreshold ?? 0
    const subject = `Low stock alert for ${product.name}`
    const html = `
        <p>Hello,</p>
        <p>This is an automated alert that <strong>${product.name}</strong> is running low in stock.</p>
        <p>
            <strong>SKU:</strong> ${product.sku}<br />
            <strong>Current stock:</strong> ${product.quantityInStock}<br />
            <strong>Low stock threshold:</strong> ${threshold}
        </p>
        <p>Please review the inventory and reorder as needed.</p>
    `

    await sendEmail(product.supplierEmail, subject, html)
    return true
}
