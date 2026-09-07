import { sendEmail } from "../services/email.service"

type LowStockAlertProduct = {
    name: string
    sku: string
    quantityInStock: number
    lowStockThreshold: number | null
    supplierEmail: string | null
    baseStock: number
}

export const sendLowStockAlertEmail = async (product: LowStockAlertProduct) => {
    if (!product.supplierEmail) return false

    const supplierSubject = `Urgent Order needed for  ${product.name}`
    const supplierHtml = `
        <p>Hello,</p>
        <p> <strong>${product.name}</strong> is running low in stock.</p>
        <strong>SKU:</strong> ${product.sku}<br />
     
        <p>Please deliver ${product.name} in ${product.baseStock} quantities as soon as possible.</p>
    `

    const ownerSubject = `Low Stock Alert for ${product.name}`
    const ownerHtml = `
        <p>Hello,</p>
        <p> <strong>${product.name}</strong> is running low in stock.</p>
        <strong>SKU:</strong> ${product.sku}<br />
        <strong>Current stock:</strong> ${product.quantityInStock}<br />
        <p>Please take necessary action to restock ${product.name}.</p>
    `

    const ownerEmail = process.env.EMAIL_FROM
    if (!ownerEmail) return false

    await sendEmail(product.supplierEmail, supplierSubject, supplierHtml)
    await sendEmail(ownerEmail, ownerSubject, ownerHtml)
    return true
}
