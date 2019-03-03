const axios = require('axios')

// serverless letlify lambda function,
// intermediate between client and github apiv4

exports.handler = (event, context, callback) => {
    const URL = `https://api.github.com/graphql`
    const accessToken = '83294b0892f9e650d275054ae98695efcc75ea5e '
    const query = `
    query {
        repository(name: "simple-lazada-cms", owner: "kuangthien") {
          object(expression: "master:package.json") {
            ... on Blob {
              text
            }
          }
        }
      }`

    // Send json response to the react client app
    const send = body => {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(body, null, 4),
        })
    }

    // Perform API call
    const getrepos = () => {
        axios({
            method: 'POST',
            url: URL,
            data: JSON.stringify({ query }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(res => send(JSON.parse(res.data.data.repository.object.text)))
            .catch(err => send(err))
    }

    // Make sure method is GET
    if (event.httpMethod == 'GET') {
        // Run
        getrepos()
    }
}
