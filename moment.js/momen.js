/*时间转换函数
  调用方式moment(data[i].created).format('YYYY-MM-DD HH:mm:ss');
*/


var strategise = {
	'YYYY-MM-DD': function(date) {
		var Y, M, D, h, m, s, last;
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate();
		last = Y + M + D;
		return last;
	},
	'YYYY-MM-DD HH:mm': function(date) {
		var Y, M, D, h, m, s, last;
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes();
		last = Y + M + D + h + m;
		return last;
	},
	'YYYY-MM-DD HH:mm:ss': function(date) {
		var Y, M, D, h, m, s, last;
		Y = date.getFullYear() + '-';
		M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		D = date.getDate() + ' ';
		h = date.getHours() + ':';
		m = date.getMinutes() + ':';
		s = date.getSeconds();
		last = Y + M + D + h + m + s;
		return last;
	}	
};
// 时间转换函数
function moment(time) {
	var date = new Date(time);
	return {
		format: function(str) {
			return strategise[str](date);
		}
	}
}