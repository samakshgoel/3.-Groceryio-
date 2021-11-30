module.exports = {
	/** function for return error response */
	errorResponse(res, status, message) {
		return res.status(status).send({ code: status, status: 'Failure', message: message })
	},

	/** function for return error reropnse */
	succesResponse(res, status, data) {
		return res.status(status).send({ code: status, status: 'Success', data: data })
	},
}