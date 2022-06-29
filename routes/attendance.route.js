class AttendanceRoute {
    constructor({ router, controller, middlewares }) {
        this.router = router()
        this.controller = controller
        this.middlewares = middlewares
    }

    get route() {
        this.router.get('/api/attendance/user_check_in_status', this.middlewares.user.verify, this.controller.getCheckInStatusByUser)
        this.router.get('/api/attendance/:id', this.middlewares.user.verify, this.controller.getOneById)
        this.router.get('/api/attendance', this.middlewares.user.verify, this.controller.getMany)
        this.router.delete('/api/attendance/:id', this.middlewares.user.verify, this.controller.deleteOneById)
        this.router.put('/api/attendance/:id', this.middlewares.user.verify, this.controller.updateOneById)
        this.router.post('/api/attendance', this.middlewares.user.verify, this.controller.createOne)
        this.router.post('/api/attendance/check_in', this.middlewares.user.verify, this.controller.checkIn)
        this.router.post('/api/attendance/check_out', this.middlewares.user.verify, this.controller.checkOut)
        this.router.post('/api/attendance/batch_delete', this.middlewares.user.verify, this.controller.deleteManyByIds)
        this.router.post('/api/attendance/batch_update', this.middlewares.user.verify, this.controller.updateManyByIds)

        return this.router
    }
}

export default AttendanceRoute