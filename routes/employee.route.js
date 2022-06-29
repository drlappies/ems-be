class EmployeeRoute {
    constructor({ router, controller, middlewares }) {
        this.router = router()
        this.controller = controller;
        this.middlewares = middlewares
    }

    get route() {
        this.router.get('/api/employee', this.middlewares.user.verify, this.controller.getMany)
        this.router.get('/api/employee/:id', this.middlewares.user.verify, this.controller.getOneById);
        this.router.post('/api/employee', this.middlewares.user.verify, this.controller.createOne);
        this.router.put('/api/employee/:id', this.middlewares.user.verify, this.controller.updateOneById);
        this.router.delete('/api/employee/:id', this.middlewares.user.verify, this.controller.deleteOneById);
        this.router.post('/api/employee/batch_update', this.middlewares.user.verify, this.controller.updateManyByIds)
        this.router.post('/api/employee/batch_delete', this.middlewares.user.verify, this.controller.deleteManyByIds)

        return this.router
    }
}

export default EmployeeRoute