import services from '../services/index.service'
import jwt from 'jsonwebtoken'
import utils from '../utils/index.util'
import error from '../constants/error'
import UserMiddleware from "./user.middleware";


const container = {
    user: new UserMiddleware({ utils, services, jwt, error })
}

export default container