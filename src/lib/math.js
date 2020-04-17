const BigNumber = require('bignumber.js')

module.exports = function summation(array) {
  return array.reduce((sum, donation) => {
    return sum.plus(donation)
  }, new BigNumber(0))
}
