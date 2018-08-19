import ServerDao from '../ServerDao';
import config from '../../../config/basic.config';
import Response from '../Response';
import axios from 'axios';
import querystring from 'querystring'; //post请求处理参数

/**
 * 用户数据连接类
 */
class UserDao extends ServerDao{

}

export default new UserDao(config.system_dns, 'public', 'blogUser');