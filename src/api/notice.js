import request from '@/utils/request.js'

//获取公告 http://canteen.tonglingok.com/apihttp://canteen.tonglingok.com/api/v1/notices/admin
export function getNotice(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/notices/admin',
		method: 'get',
		params: data
	});
};

//删除公告
export function deleteNotice(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/notice/delete',
		method: 'post',
		data
	});
};

//获取部门列表
export function getDepartment() {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/admin/departments',
		method: 'get'
	});
};

//获取部门人员列表
export function getStaffs(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/department/staffs',
		method: 'get',
		params: data
	});
};
//新增评论
export function addNotice(data) {
	return request({
		url: 'http://canteen.tonglingok.com/api/v1/notice/save',
		method: 'post',
		data
	});
};

//获取通知列表
export function getUserNotice(data){
	return request({
		url:'http://canteen.tonglingok.com/api/v1/notices/user',
		method:'get',
		params:data
	});
};