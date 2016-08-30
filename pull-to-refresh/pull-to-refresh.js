	var Event = function(){
		var clientList = {},
			listen,
			trigger,
			remove;

		listen = function (key, fn) {
			if( !clientList[key]) {
				clientList[key] = [];
			}
			clientList[key].push(fn);
		};

		trigger = function() {
			var key = Array.prototype.shift.call(arguments),
				fns = clientList[key];
			if (!fns || fns.length === 0) {
				return false;
			}
			for(var i = 0, fn; fn = fns[i++];) {
				fn.apply(this, arguments);
			}
			
		};

		remove = function(key, fn) {
			var fns = clientList[key];
			if(!fns) {
				return;
			}
			if(!fn) {
				fns && (fns.length = 0);
			}
			for (var l = fns.length - 1; l >= 0; l--) {
				var _fn = fns[l];
				if (_fn === fn) {
					fns.splice(l, 1);
				}
			}
		};
		return {
			listen: listen,
			trigger: trigger,
			remove: remove
		}
	}();
 	var pageSize = 10;

	var scrollCount = false;
	$(document).on('scroll',function(e) {
		if(scrollCount) {
			return;
		}
		var scrollTop = this.scrollTop,
			scrollHeight = this.scrollHeight,
			clientHeight = this.clientHeight; //pageNo = document.querySelectorAll('.headflag').length
		if(scrollTop + clientHeight > scrollHeight - 50) {
			scrollCount = true;
			proxygetList();
		}
	}); 	
	var proxygetList = function() {
		var loading = $(".infinite-scroll-preloader");
		loading.hide();
		var cache = 0,
			totalCount ,
			msg;
		var pageNo = 1; // 默认PageNo=1
		Event.listen('getSuccess',function(e){   // 要增加请求失败后的提示
			totalCount = e.totalCount;
			scrollCount = false; // 请求成功后才能再次请求
			loading.hide();  // 请求成功后隐藏菊花图
			pageNo+=1; // 请求下一页
		})
		Event.listen('getFalse',function(e){   // 请求失败后的提示
			totalCount = e.totalCount;
			scrollCount = false; // 请求完成后才能再次请求
			loading.hide();  // 请求成功后隐藏菊花图
		})
		return function(){
			if(totalCount === 0 ) {return;}
			if(totalCount === undefined || pageNo <= totalCount/pageSize + 1) {
				loading.show();
				getList(pageNo);
				
			}
		}
	}();

	proxygetList(); 