class UserRoute {
    constructor({ router, controller, middlewares }) {
        this.router = router()
        this.controller = controller
        this.middlewares = middlewares
    }

    get route() {
        this.router.get('/api/user', this.middlewares.user.verify, this.controller.getUser)
        this.router.get('/api/user/attendance', this.middlewares.user.verify, this.controller.getAttendanceByUser)
        this.router.get('/api/user/leave', this.middlewares.user.verify, this.controller.getLeaveByUser)
        this.router.get('/api/user/payroll', this.middlewares.user.verify, this.controller.getPayrollByUser)

        return this.router
    }
}

export default UserRoute