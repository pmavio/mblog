let weconfig={
		return_uri:"app/weixin/api/",
		server_mobile:"mobile/#/mobile",
		scope:"snsapi_base",
		page_auth_url:"https://open.weixin.qq.com/connect/oauth2/authorize",
		token:"playinhq",
		wx_body:"停车缴费",
		wx_attach:"停车缴费",
		pay_time_out:5,
		pay_success:'app/weixin/pay/wxPayResult',
		spbill_create_ip:"8.8.8.8",
		order_time:30
	}
module.exports =  weconfig;