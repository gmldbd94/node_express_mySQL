const SendJson = {
    successTrue: (message, data) => {
        return {
            success: true,
            message: message,
            data: data
        }
    },
    successFalse: (message) => {
        return {
            success: false,
            message: message
        }
    },
}
module.exports = SendJson