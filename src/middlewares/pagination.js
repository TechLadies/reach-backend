module.exports = function(req, _, next) {
    let currentPage = 1
    let perPage = 10

    const parsedPerPageQuery = parseInt(req.query.perPage)
    const parsedPageQuery = parseInt(req.query.page)

    if (isNaN(parsedPerPageQuery) === false) {
        perPage = parsedPerPageQuery
    }

    if (isNaN(parsedPageQuery) === false || parsedPageQuery > 0) {
        currentPage = parsedPageQuery
    }

    const limit = perPage < 100 && perPage > 0 ? perPage : 10
    const offset = limit * (currentPage - 1)

    req.customParams = Object.assign({}, req.customParams, {
        limit, offset
    })

    next()
}