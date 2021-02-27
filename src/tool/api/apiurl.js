const baseURL = 'http://39.99.193.63:8889'+'/api' //设置默认基础地址  /api  location.origin http://119.23.22.57:8889
export default {
  upload: baseURL + '/upload',
  getCode: baseURL + '/getCode', //取得验证码
  sendEmail: baseURL + '/sendEmail', //发送验证码

  login: baseURL + '/login', //登陆
  addUser: baseURL + '/addUser', //添加用户
  userQuery: baseURL + '/userQuery', //查询所有用户
  userQueryId:baseURL + '/userQueryId', //根据id查询用户信息
  delectUser: baseURL + '/delectUser', //删除用户
  searchUser: baseURL + '/searchUser', //模糊查询用户
  updateUser: baseURL + '/updateUser', //修改用户信息
  judegeUserName: baseURL + '/judegeUserName', //用户名是否存在
  addNewUser:baseURL + '/addNewUser',
  stopUser:baseURL + '/stopUser', //禁用启用
  queryRoot:baseURL + '/queryRoot', //查询用户权限
  queryRootList:baseURL + '/queryRootList', //查询所有权限
  saveRoot:baseURL + '/saveRoot', //保存权限修改
}
