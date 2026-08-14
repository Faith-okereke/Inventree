"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const orders_route_1 = __importDefault(require("./routes/orders.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const error_handler_1 = require("./middleware/error-handler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const rate_limiter_middleware_1 = require("./middleware/rate-limiter.middleware");
const app = (0, express_1.default)();
const port = Number(process.env.SERVER_PORT ?? process.env.PORT ?? 3000);
app.use(express_1.default.json());
app.use('/api/auth', auth_route_1.default);
app.use('/api/products', products_route_1.default);
app.use('/api/orders', orders_route_1.default);
app.use('/api/users', user_route_1.default);
app.use('/api/dashboard', dashboard_route_1.default);
app.use(rate_limiter_middleware_1.limiter);
app.use(error_handler_1.errorHandler);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    swaggerOptions: {
        // Sort operations alphabetically within each tag group.
        // Tag group order itself comes from `tags` in config/swagger.ts.
        operationsSorter: "alpha",
    },
}));
app.listen(port, () => {
    console.log(`Port is listening on ${port}`);
});
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});
