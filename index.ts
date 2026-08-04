import express, { Router } from "express"
import authRoute from "./routes/auth.route"
import productRoute from "./routes/products.route"
import ordersRoute from "./routes/orders.route"
import userRoute from "./routes/user.route"
import dashboardRoute from './routes/dashboard.route'
import { errorHandler } from "./middleware/error-handler"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express()

const port = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 3000)

app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', ordersRoute)
app.use('/api/users', userRoute)
app.use('/api/dashboard', dashboardRoute)

app.use(errorHandler)


app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            // Sort operations alphabetically within each tag group.
            // Tag group order itself comes from `tags` in config/swagger.ts.
            operationsSorter: "alpha",
        },
    })
)

app.listen(port, () => {
    console.log(`Port is listening on ${port}`)
})

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});
