class TimeUtil {
    getCurrentTime = () => {
        return new Date()
    }

    getDate = () => {
        const currentTime = new Date()
        const date = `${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()}`
        return date
    }

    getTime = () => {
        const currentTime = new Date()
        const from = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`
        return from
    }
}

export default TimeUtil