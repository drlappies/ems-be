class UserMiddleware {
    constructor({ utils, services, jwt, error }) {
        this.utils = utils
        this.services = services
        this.jwt = jwt
        this.error = error
    }

    verify = async (req, res, next) => {
        try {
            const token = req.headers.token

            const decoded = await this.jwt.verify(token, process.env.SECRET)

            const user = await this.services.employee.getOneById(decoded.id)

            if (user.status === "unavailable") {
                res.status(401).json(this.error.user_unavailable)
                return
            }

            req.user = user

            next()
        } catch (error) {
            res.status(401).json(this.error.unauthorised)
        }
    }

    verifyStatus = async (req, res, next) => {
        try {
            let user = req.user

            if (!user) {
                const token = req.headers.token
                const decoded = await this.jwt.verify(token, process.env.SECRET)

                user = await this.services.employee.getOneById(decoded.id)
                req.user = user
            }

            if (user.status === "unavailable") {
                res.status(401).json(this.error.user_unavailable)
                return
            }

            next()
        } catch (error) {
            res.status(401).json(this.error.unauthorised)
        }
    }

    verifyRole = async (req, res, next) => {
        try {
            let user = req.user

            if (!user) {
                const token = req.headers.token
                const decoded = await this.jwt.verify(token, process.env.SECRET)

                user = await this.services.employee.getOneById(decoded.id)
                req.user = user
            }

            if (user.role === "employee") {
                res.status(401).json(this.error.user_unavailable)
                return
            }

            next()
        } catch (error) {
            res.status(401).json(this.error.unauthorised)
        }
    }
}

export default UserMiddleware