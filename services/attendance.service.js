class AttendanceService {
    constructor(models, repositories) {
        this.models = models
        this.repositories = repositories
    }

    checkIn = async (employee, date, time) => {
        try {
            const attendance = this.models.attendance.create();

            attendance.employee_id = employee.id;
            attendance.date = date;
            attendance.check_in_time = time;
            attendance.check_out_time = null;

            if (time > employee.start_work_time) {
                attendance.status = "late"
            } else {
                attendance.status = "on_time"
            }

            const result = await this.repositories.attendance.createOne(attendance, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    checkOut = async (employee, date, time) => {
        try {
            const query = (qb) => {
                qb.where('employee_id', employee.id)
                qb.andWhere('date', date)
            }

            const result = await this.repositories.attendance.updateOne(query, { check_out_time: time }, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    getOneById = async (id) => {
        try {
            const result = await this.repositories.attendance.getOneById(id)

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
            const status = params.status
            const mindate = params.mindate
            const maxdate = params.maxdate
            const employeeId = params.employee_id
            const role = params.role
            const orderBy = params.orderBy
            const order = params.order

            const query = (qb) => {
                qb.join('employee', 'attendance.employee_id', 'employee.id')
                qb.select(['attendance.id', 'attendance.employee_id', 'employee.firstname', 'employee.lastname', 'attendance.date', 'attendance.check_in_time', 'attendance.check_out_time', 'attendance.status'])

                if (search) qb.whereRaw(`to_tsvector(employee.firstname || ' ' || employee.lastname) @@ plainto_tsquery('${search}')`)
                if (employeeId) qb.where('attendance.employee_id', '=', employeeId);
                if (status) qb.where('attendance.status', '=', status);
                if (role) qb.where('employee.role', '=', role)
                if (mindate) qb.where('attendance.date', '>=', mindate);
                if (maxdate) qb.where('attendance.date', '<=', maxdate);
            }

            const result = await this.repositories.attendance.getMany(query, { offset, limit, orderBy, order })

            return result
        } catch (error) {
            throw error
        }
    }

    getManyByIds = async (ids) => {
        try {
            const query = (qb) => {
                qb.whereIn('id', [...ids])
            }

            const result = await this.repositories.attendance.getMany(query, {})

            return result
        } catch (error) {
            throw error
        }
    }

    getOneByEmployeeIdAndDate = async (employeeId, date) => {
        try {
            const query = (qb) => {
                qb.where('employee_id', employeeId)
                qb.andWhere('date', date)
            }

            const result = await this.repositories.attendance.getOne(query)

            return result
        } catch (error) {
            throw error
        }
    }

    deleteOneById = async (id) => {
        try {
            await this.repositories.attendance.deleteOneById(id)
        } catch (error) {
            throw error
        }
    }

    updateOneById = async (id, data) => {
        try {
            const result = await this.repositories.attendance.updateOneById(id, data, ['*'])
            return result
        } catch (error) {
            throw error
        }
    }

    deleteManyByIds = async (ids) => {
        try {
            await this.repositories.attendance.deleteManyByIds(ids)
        } catch (error) {
            throw error
        }
    }

    updateManyByIds = async (ids, data) => {
        try {
            const result = await this.repositories.attendance.updateManyByIds(ids, data, ['*'])
            return result
        } catch (error) {
            throw error
        }
    }

    createOne = async (employeeId, date, checkInTime, checkOutTime, status) => {
        try {
            const attd = this.models.attendance.create();
            attd.employee_id = employeeId
            attd.date = date
            attd.check_in_time = checkInTime
            attd.check_out_time = checkOutTime
            attd.status = status

            const result = await this.repositories.attendance.createOne(attd, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }
}

export default AttendanceService