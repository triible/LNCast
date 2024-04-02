import lnService from 'ln-service'
import config from '../config.js';

const refundMiddleware = async (req, res, next) => {
    try {
        const { LN_CERT, LN_REFUND_MACAROON, LN_SOCKET } = process.env;
        const { lnd } = lnService.authenticatedLndGrpc({
            cert: LN_CERT,
            macaroon: LN_REFUND_MACAROON,
            socket: LN_SOCKET,
        })

        req.refundLnd = lnd

        next()
    } catch (error) {
        console.error(
            'Problem with configs for connecting to lightning node:',
            error.message
          )
          next("Could not connect to the paywall's lightning node.")
    }
}

export default refundMiddleware;
