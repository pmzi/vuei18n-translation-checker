import logger from './logger'

export default {

  __convertObjectToArray(object, prefix = '') {
    const texts = []
    const keys = Object.keys(object)
    keys.forEach(key => {
      const value = object[key]
      if (typeof value === 'object') {
        texts.push(...this.__convertObjectToArray(value, `${prefix}${key}.`))
      } else {
        texts.push({
          key: `${prefix}${key}`,
          value: value.trim()
        })
      }
    })
    return texts
  },

  __checkArrayForDuplication(array) {
    array.forEach(item => {
      for (const arrayItem of array) {
        if (arrayItem.value.trim() === item.value.trim() && arrayItem.key !== item.key) {
          logger.error(`Duplicate text: '${item.value}' key: '${item.key}'`)
          break
        }
      }
    })
  },

  __compareArrays(arr1, arr2) {
    arr1.forEach(({key, value}) => {
      for (const item of arr2) {
        if (item.value.trim() === value.trim()) {
          logger.error(`Duplicate in multiple locales: ${key}: ${value} == ${item.key}: ${item.value}`)
          break
        }
      }
    })
  },

  __mergeArrays(arr1, arr2) {
    arr1.forEach(({key, value}) => {
      for (const item of arr2) {
        if (item.value.trim() === value.trim()) {
          return
        }
      }
      arr2.push(
        {
          key,
          value
        }
      )
    })
    return arr2
  },

  checkForDuplicateText(messages) {
    const usedTexts = []

    const locales = Object.keys(messages)
    locales.forEach(locale => {
      const currentLocaleMessages = this.__convertObjectToArray(messages[locale], `${locale}.`)

      this.__checkArrayForDuplication(currentLocaleMessages)

      this.__compareArrays(usedTexts, currentLocaleMessages)

      this.__mergeArrays(currentLocaleMessages, usedTexts)
    })
  }

}
