"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_middleware_1 = require("../middleware/role.middleware");
const dashboard_service_1 = require("../services/dashboard.service");
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
const router = (0, express_1.Router)();
router.get('/', require_auth_middleware_1.requireAuth, (0, role_middleware_1.requireRole)('admin'), async (req, res) => {
    try {
        const dashboard = await (0, dashboard_service_1.getOrderDashboard)();
        return res.status(200).json({ status: 200, data: dashboard });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
