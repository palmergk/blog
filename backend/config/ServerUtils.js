
exports.ServerError = (res, error) => {
    return res.json({
        status: 500,
        msg: 'Something went wrong, try again later',
        stack: error
    })
}

exports.UserExcludes = ['password', 'createdAt', 'updatedAt', 'email', 'role', 'email_verified', 'resetcode']