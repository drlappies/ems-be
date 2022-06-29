import bcrypt from 'bcrypt'
import PasswordUtil from './password.util'
import TimeUtil from './time.util'

const container = {
    password: new PasswordUtil({ salt: 10, bcrypt }),
    time: new TimeUtil()
}

export default container