export async function handler(event, context, callback) {
    try {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Max-Age': '2592000',
            'Access-Control-Allow-Credentials': 'true',
        }

        return {
            isBase64Encoded: false,
            statusCode: 200,
            body: JSON.stringify({ api_ok: true }),
            headers: {
                ...headers,
            },
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }),
            // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}
