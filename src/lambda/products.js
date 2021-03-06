const axios = require('axios')
const yamlFront = require('yaml-front-matter')

// serverless letlify lambda function,
// intermediate between client and github apiv4

const URL = `https://api.github.com/graphql`
const accessToken = process.env.GITHUB_TOKEN;

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Max-Age': '2592000',
    'Access-Control-Allow-Credentials': 'true',
}

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
            list.push({
                _id: listPath[i].name.replace('.md', ''),
                imageUrl: rs.productFeaturedImage,
                title: rs.title,
                desc: rs.__content,
                prices: {
                    regular: rs['price-regular'],
                    old: rs['price-old'],
                },
            })
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

            isBase64Encoded: false,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        }
    } catch (e) {
        console.log(e) // output to netlify function log
        return {
            statusCode: 500,
            body: e.message, // Could be a custom message or object i.e. JSON.stringify(err)
        }
    }
}
