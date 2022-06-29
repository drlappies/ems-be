class LeaveService {
    constructor(models, repositories) {
        this.models = models
        this.repositories = repositories
    }

    getOneById = async (id) => {
        try {
            const query = (qb) => {
                qb.join('employee', 'leave.employee_id', 'employee.id')
                qb.select(['leave.id', 'leave.employee_id', 'leave.reason', 'leave.status', 'leave.duration', 'leave.from', 'leave.to', 'employee.firstname', 'employee.lastname', 'leave.type'])
                qb.where('leave.id', id)
            }

            const result = await this.repositories.leave.getOne(query)

            return result
        } catch (error) {
            throw error
        }
    }

    getMany = async (params) => {
        try {
            const offset = params.offset
            const limit = params.limit
            const search = params.search
            const employee_id = params.employee_id
            const mindate = params.mindate
            const maxdate = params.maxdate
            const status = params.status
            const leave_type = params.leave_type
            const span = params.span
            const orderBy = params.orderBy
            const order = params.order

            const query = (qb) => {
                qb.join('employee', 'leave.employee_id', 'employee.id')
                qb.select(['leave.id', 'leave.employee_id', 'leave.remark', 'leave.status', 'leave.date', 'employee.firstname', 'employee.lastname', 'leave.leave_type', 'leave.span'])
                if (search) qb.whereRaw(`to_tsvector(employee.firstname || ' ' || employee.lastname || ' ' || leave.remark) @@ plainto_tsquery('${search}')`)
                if (employee_id) qb.where('leave.employee_id', '=', employee_id);
                if (mindate) qb.where('leave.date', '>=', mindate)
                if (maxdate) qb.where('leave.date', '<=', maxdate)
                if (status) qb.where('leave.status', '=', status)
                if (leave_type) qb.where('leave.leave_type', '=', leave_type)
                if (span) qb.where('span', '=', span)
            }

            const result = await this.repositories.leave.getMany(query, { offset, limit, orderBy, order })

            return result
        } catch (error) {
            throw error
        }
    }

    createOne = async (employeeId, date, span, type, remark) => {
        try {
            const leave = this.models.leave.create();

            leave.employee_id = employeeId;
            leave.date = date;
            leave.span = span;
            leave.leave_type = type;
            leave.remark = remark;
            leave.status = "pending"

            const result = await this.repositories.leave.createOne(leave, ['*'])
            return result
        } catch (error) {
            throw error
        }
    }

    updateOneById = async (id, params) => {
        try {
            const leave_type = params.leave_type
            const status = params.status
            const remark = params.remark
            const span = params.span

            const data = {}

            if (span) data.span = span
            if (leave_type) data.leave_type = leave_type
            if (status) data.status = status
            if (remark) data.remark = remark
            if (span) data.span = span

            const result = await this.repositories.leave.updateOneById(id, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    updateManyByIds = async (ids, params) => {
        try {
            const leave_type = params.leave_type
            const status = params.status
            const remark = params.remark
            const span = params.span

            const data = {}

            if (span) data.span = span
            if (leave_type) data.leave_type = leave_type
            if (status) data.status = status
            if (remark) data.remark = remark
            if (span) data.span = span

            const result = await this.repositories.leave.updateManyByIds(ids, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    deleteOneById = async (id) => {
        try {
            await this.repositories.leave.deleteOneById(id)
        } catch (error) {
            throw error
        }
    }

    deleteManyByIds = async (ids) => {
        try {
            await this.repositories.leave.deleteManyByIds(ids)
        } catch (error) {
            throw error
        }
    }

    getManyByIds = async (ids) => {
        try {
            const query = (qb) => {
                qb.whereIn('id', ids)
            }

            const result = await this.repositories.leave.getMany(query, {})

            return result
        } catch (error) {
            throw error
        }
    }
}

export default LeaveService