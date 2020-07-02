import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function pageAreaPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const pageareas = store.getters && store.getters.partialArea
    const permissionAreas = value
    const hasPermission = pageareas.some(area => {
      return permissionAreas.includes(area)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}
