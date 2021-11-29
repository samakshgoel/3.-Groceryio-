const jwt =  require('express-jwt')
const secret= process.env.JWT_KEY;
const configjson= require("config.json");
const {adminModule,userModule}= require('../model');


module.exports = authorize;

function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret:secret, algorithms: ['HS256'] }),

        // authorize based on user role
        (req, res, next) => {
                        
            if (roles.length && !roles.includes(req.user.roles)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            switch (req.user.roles) {
            case 'User':
                userModule.getUser({_id:req.user._id}).then(
                    user => {
                        if (user) {
                            req.user = user
                            req.userType = 'User'
                            next()
                        } else {
                        return res.status(404).json({ message: 'User Not Found' })
                        }
                    }
                )
            break
            case 'Admin':
				adminModule.getAdmin(req.user.email).then(
					user => {
    
						if (user) {
							req.user = user
							req.userType = 'Admin'
							next()
						} else {
							return res.status(404).json({ message: 'Admin Not Found' })
						}
					}
				)
			break

            case 'Shipper':
                adminModule.getShipperByEmail(req.user.email).then(
                    user => {
    
                        if (user) {
                            req.user = user
                            req.userType = 'Shipper'
                            next()
                        } else {
                            return res.status(404).json({ message: 'shipper Not Found' })
                        }
                    }
                )
            break
            default:
                return res.status(404).json({ message: 'User Not Found' })

            }
        }
    ]
}