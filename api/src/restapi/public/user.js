/**
 * 菜单路由
 */

import KoaRouter from 'koa-router';
import Response from "../Response";
import userDao from '../dao/userDao';
import encode from '../../utils/encode';
import jwt from 'jsonwebtoken';
import configs from '../../../config/basic.config';

const router = new KoaRouter();
router.prefix = 'user';

/**
 * 用户注册
 */
router.post('/register', async ctx => {
    let {username, password} = ctx.request.body;

    if(!username || username.length < 3){
        ctx.body = new Response().failure('用户名格式错误');
    }else if(!password || password.length < 6){
        ctx.body = new Response().failure('密码格式错误');
    }

    let count = await userDao.getCount({username, password});
    if(!Response.isSuccess(count)){
        ctx.body = count;
        return;
    }else if(count.result > 0){
        ctx.body = new Response().failure('账号已被注册');
        return;
    }

    password = encode.md5(password);

    ctx.body = await userDao.insert({username, password});
});

/**
 * 用户登录
 */
router.post('/login', async ctx => {
    let {username, password} = ctx.request.body;
    password = encode.md5(password);

    let userList = await userDao.getList({username, password});
    if(!Response.isSuccess(userList)){
        ctx.body = userList;
        return;
    }else if(userList.result.length === 0){
        ctx.body = new Response().failure('错误的用户名或密码');
        return;
    }

    let user = userList.result[0];
    let tokenContent = {
        user,
    };

    user.token = jwt.sign(tokenContent, configs.jwtSecret, {expiresIn: '10h'});

    ctx.body = new Response().success(user);
});

export default router;