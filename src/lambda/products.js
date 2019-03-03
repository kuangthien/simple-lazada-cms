const axios = require('axios')
// serverless letlify lambda function,
// intermediate between client and github apiv4

const URL = `https://api.github.com/graphql`
const accessToken = 'daa6188758a55d5f62b4e57719d417d9f29947f6 '
const yamlFront = require('yaml-front-matter')

const getProductDetailData = fileName => {
    const query = `
    query {
        repository(name: "simple-lazada-cms", owner: "kuangthien") {
            object(expression: "master:content/products/${fileName}") {
                ... on Blob {
                    text
                }
            }
        }
    }`
    console.log(fileName)
    return axios({
        method: 'POST',
        url: URL,
        data: JSON.stringify({ query }),
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(res => yamlFront.loadFront(res.data.data.repository.object.text))
        .catch(e => e)
}
const getResponseBody = async () => {
    const listPath = (await getListProductsPath()) || []
    list = []

    await (async function loop() {
        for (let i = 0; i < listPath.length; i++) {
            rs = await getProductDetailData(listPath[i].name)
            list.push(rs)
        }
    })()

    console.log(list)
    return list
}

// Perform API call
const getListProductsPath = () => {
    const query = `
        query {
            repository(name: "simple-lazada-cms", owner: "kuangthien") {
                object(expression: "master:content/products") {
                ... on Tree {
                    entries {
                    name
                    }
                }
                }
            }
        }`
    return axios({
        method: 'POST',
        url: URL,
        data: JSON.stringify({ query }),
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(res => res.data.data.repository.object.entries)
        .catch(err => err)
}
exports.handler = async (event, context, callback) => {
    // Make sure method is GET
    try {
        // Run
        const body = await getResponseBody()
        return {
            statusCode: 200,
            body: JSON.stringify(body, null, 4),
        }
    } catch (e) {
        console.log(e) // output to netlify function log
        return {
            statusCode: 500,
            body: e.message, // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}
