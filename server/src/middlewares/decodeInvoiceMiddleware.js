import lnService from 'ln-service'

const decodeInvoiceMiddleware = async (req, res, next) => {
    try {
        const { LN_CERT, LN_DECODE_INVOICE_MACAROON, LN_SOCKET } = process.env;

        const { lnd } = lnService.authenticatedLndGrpc({
            cert: LN_CERT,
            macaroon: LN_DECODE_INVOICE_MACAROON,
            socket: LN_SOCKET,
        })
        req.decodeLnd = lnd

        next()
    } catch (error) {
        console.error(
            'Problem with configs for connecting to lightning node:',
            error.message
          )
          next("Could not connect to the paywall's lightning node.")
    }
}

export default decodeInvoiceMiddleware;