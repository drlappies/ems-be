class EmployeeService {
    constructor(models, repositories) {
        this.models = models
        this.repositories = repositories
    }

    createOne = async (username, password, role, firstname, lastname, joinedDate, monthlySalary, startHour, endHour) => {
        try {
            const employee = this.models.employee.create();
            employee.username = username;
            employee.password = password;
            employee.role = role;
            employee.firstname = firstname;
            employee.lastname = lastname;
            employee.joined_date = joinedDate;
            employee.monthly_salary = monthlySalary;
            employee.start_work_time = startHour;
            employee.end_work_time = endHour;
            employee.status = "available";

            const result = await this.repositories.employee.createOne(employee, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    updateOneById = async (id, params) => {
        try {
            const data = {}
            if (params.username) data.username = params.username
            if (params.password) data.password = params.password
            if (params.firstname) data.firstname = params.firstname
            if (params.lastname) data.lastname = params.lastname
            if (params.address) data.address = params.address
            if (params.phone_number) data.phone_number = params.phone_number
            if (params.start_work_time) data.start_hour = params.start_work_time;
            if (params.end_work_time) data.end_hour = params.end_work_time;
            if (params.monthly_salary) data.monthly_salary = params.monthly_salary;
            if (params.status) data.status = params.status;
            if (params.role) data.role = params.role;

            const result = await this.repositories.employee.updateOneById(id, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    updateManyByIds = async (ids, params) => {
        try {
            const data = {}
            if (params.username) data.username = params.username
            if (params.password) data.password = params.password
            if (params.firstname) data.firstname = params.firstname
            if (params.lastname) data.lastname = params.lastname
            if (params.address) data.address = params.address
            if (params.phone_number) data.phone_number = params.phone_number
            if (params.start_work_time) data.start_work_time = params.start_work_time;
            if (params.end_work_time) data.end_work_time = params.end_work_time;
            if (params.monthly_salary) data.monthly_salary = params.monthly_salary;
            if (params.status) data.status = params.status;
            if (params.role) data.role = params.role;

            const result = await this.repositories.employee.updateManyByIds(ids, data, ['*'])

            return result
        } catch (error) {
            throw error
        }
    }

    getOneById = async (id) => {
        try {
            const result = await this.repositories.employee.getOneById(id)
            return result
        } catch (error) {
            throw error
        }
    }

    getMany = async (params) => {
        try {
            const offset = params.offset
            const limit = params.limit
            const minpay = params.minpay
            const maxpay = params.maxpay
            const role = params.role
            const search = params.search
            const status = params.status
            const orderBy = params.orderBy
            const order = params.order
            const mindate = params.mindate
            const maxdate = params.maxdate

            const query = (qb) => {
                qb.select(['employee.id', 'employee.firstname', 'employee.lastname', 'employee.monthly_salary', 'employee.address', 'employee.phone_number', 'employee.start_work_time', 'employee.end_work_time', 'employee.joined_date', 'employee.status', 'employee.created_at', 'employee.updated_at', 'employee.role'])
                if (minpay && maxpay) qb.whereBetween('employee.monthly_salary', [minpay, maxpay])
                if (status) qb.where('employee.status', '=', status)
                if (role) qb.where('employee.role', '=', role)
                if (search) qb.whereRaw(`to_tsvector(employee.firstname || ' ' || employee.lastname || ' ' || employee.address) @@ plainto_tsquery(${search})`)
                if (mindate) qb.where('employee.joined_date', '>=', mindate)
                if (maxdate) qb.where('employee.joined_date', '<=', maxdate)
            }

            const result = await this.repositories.employee.getMany(query, { offset, limit, orderBy, order })

            return result
        } catch (error) {
            throw error
        }
    }

    deleteOneById = async (id) => {
        try {
            await this.repositories.employee.deleteOneById(id)
        } catch (error) {
            throw error
        }
    }

    deleteManyByIds = async (ids) => {
        try {
            await this.repositories.employee.deleteManyByIds(ids)
        } catch (error) {
            throw error
        }
    }

    getOneByUsername = async (username) => {
        try {
            const query = (qb) => {
                qb.where('username', '=', username)
            }

            const result = await this.repositories.employee.getOne(query)

            return result
        } catch (error) {
            throw error
        }
    }
}

export default EmployeeService