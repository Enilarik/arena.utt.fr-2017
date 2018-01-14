module.exports = (value) => {
    return /^[A-zÀ-ÿ \[\]\(\)\.,;:\d]+$/.test(value)
}
