import ServerDao from '../ServerDao';
import config from '../../../config/basic.config';
import Response from '../Response';
import axios from 'axios';
import querystring from 'querystring'; //post请求处理参数

/**
 * 菜单数据连接类
 */
class MenuDao extends ServerDao{

}

export default new MenuDao(config.system_dns, 'mblog', 'menu');