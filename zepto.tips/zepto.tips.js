/**
 * 提示框
	css引入tips.css
	调用方法 
	$.tips({
		text: '请输入正确的信息',
		fixed: true， // 可选，设置了之后无法点击关闭弹框
		setTime: true， // 可选，设置了可以通过time属性配置自动关闭时间，默认5S
		time： 5000，// 可选，只有设置了setTime才能生效，用于配置时间
	})
 */
;+function($){
	$.tips = function () {
	    var tips = $('<div>').addClass('tips');
	    var icon = $('<div>').addClass('tips-icon icon iconfont');
	    var text = $('<p>').addClass('tips-text');
	    var setting = {
	        text: '请输入正确的手机号码',
	        icon: 'iconfont-tips'
	    };
	    tips.append(icon);
	    tips.append(text);
	    return function (obj) {
	        $.extend(true, setting, obj);
	        icon.addClass(setting.icon);
	        text.text(setting.text);
	        $('body').append(tips);
	        if(!obj.fixed) {// 如果传入对象有fixed属性。就取消点击移除功能
	        	$('body').one('click', function() {
		           tips.remove();
		        });	
        	} 
	        if(obj.setTime){
	        	var time = obj.time || 5000;
	        	console.log(time);
	        	var timer = setTimeout(function(){
	        		tips.remove();
	        		clearTimeout(timer);
	        	},time);
	        }
	    };
	}();
}(Zepto);
	
