
class CustomErrorHandler extends Error {

    constructor(status, message ){
        this.status = status,
        this.message = message
    }
    static alreadyExist( message ){   // when we create static method no need to create a object outside
        return new CustomErrorHandler(409 , message)
    }
}

export default CustomErrorHandler