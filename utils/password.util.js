class PasswordUtil {
    constructor({ salt, bcrypt }) {
        this.salt = salt
        this.bcrypt = bcrypt
    }

    hashPassword = async (password) => {
        return await this.bcrypt.hash(password, this.salt)
    }

    validatePassword = async (plainPw, hashedPw) => {
        return await this.bcrypt.compare(plainPw, hashedPw);
    }
}

export default PasswordUtil