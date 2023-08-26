
class CustomErrorHandler extends Error {

    constructor(status, message ){
        super()
        this.status = status,
        this.message = message
    }
    static alreadyExist( message ){   // when we create static method no need to create a object outside
        return new CustomErrorHandler(409 , message)
    }
    static wrongCredentials(message = "Invalid username and password"){
        return new CustomErrorHandler(401, message)
    }
    static unAuthorized(message = "UnAuthorized Access"){
        return new CustomErrorHandler(401, message)
    }
    static notFound(message = "User not found"){
        return new CustomErrorHandler(404, message)
    }

}

export default CustomErrorHandler