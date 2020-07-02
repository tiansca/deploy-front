const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.id,
  roles: state => state.user.roles,
  partialArea: state => state.user.partialArea,
  permission_routes: state => state.permission.routes,
  report_scoure: state => state.report.source
}
export default getters
