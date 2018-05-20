import ServerDao from '../ServerDao';
import config from '../../../config/basic.config';
import Response from '../Response';
import axios from 'axios';
import querystring from 'querystring'; //post请求处理参数

/**
 * 菜单数据连接类
 */
class BandDao extends ServerDao{

}

export default new BandDao(config.system_dns, 'band', 'band');