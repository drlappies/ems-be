class PayrollRoute {
    constructor({ router, controller, middlewares }) {
        this.router = router()
        this.controller = controller
        this.middlewares = middlewares
    }

    get route() {
        this.router.post('/api/payroll', this.middlewares.user.verify, this.controller.createOne);
        this.router.put('/api/payroll/:id', this.middlewares.user.verify, this.controller.updateOneById);
        this.router.delete('/api/payroll/:id', this.middlewares.user.verify, this.controller.deleteOneById);
        this.router.get('/api/payroll', this.middlewares.user.verify, this.controller.getMany);
        this.router.get('/api/payroll/:id', this.middlewares.user.verify, this.controller.getOneById);
        this.router.post('/api/payroll/batch_update', this.middlewares.user.verify, this.controller.updateManyByIds)
        this.router.post('/api/payroll/batch_delete', this.middlewares.user.verify, this.controller.deleteManyByIds)

        return this.router
    }
}

export default PayrollRoute