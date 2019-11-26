import request from '@/utils/request.js';

export function getOrderDetail() {
  return request({
    url: 'http://canteen.tonglingok.com/api/v1/order/online/info',
    method: 'get',
  })
}

export function getUserOrder(data) {
  return request({
    url: 'http://canteen.tonglingok.com/api/v1/order/userOrdering',
    method: 'get',
    params: data
  })
}