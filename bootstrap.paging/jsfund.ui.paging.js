/*/* 调用方法：html页面添加<div id ='paging'></div> 
 * 
 * 
 * jsfund.ui.paging.render({
			pageNo: pageNo,
			pagingDiv: $("#paging"),
			totalCount: result.totalCount,
			pageSize: jsfund.constants.DEFAULT_PAGE_SIZE,
			callback : function(thispageNo){
				if(pageNo !== thispageNo) {
					pageNo = thispageNo;
					loadData();
				}		
			}
		});
 * */
 var jsfund = {};
 
(function (ui) {
	var paging = {
		_skin: {
            wrap  : '<ul class="pagination"></ul>',
            first : '<li><a href="#" aria-label="Previous">上一页</a></li>',
            last  : '<li><a href="#" aria-label="Next">下一页</a></li>',
            firstPage  : '<li><a href="#" aria-label="firstPage">首页</a></li>',
            lastPage  : '<li><a href="#" aria-label="lastPage">尾页</a></li>',
            item  : '<li><a href="#" data-page="{page1}">{page2}</a></li>',
            gotoInput : '<li style="margin:0 10px; "><input class="form-control"  id="gotoPage" type="num" ></li>',
            goBtn: '<li><a  href="#" aria-label="goBtn">Go</a></li>',
            disabledClass: "disabled",
            activeClass  : "active",
            ellipsis: '<li class="disabled" disabled=disabled><a href="#" aria-label="ellipsis">...</a></li>',
            message: '<span class="pagingMsg"></span>'
        },
		init: function() {
			this.pagingDiv = $();
    		this.ul = this._skin.wrap;
			this.totalCount = 0;
	        this.pageCurrent = 1;
	        this.pageSize = 1;
	        this.pageCount = 10;   //一共分多少页
	        this.callback = function(){};
	        this.max = 7 ;//最多显示7页，中间的用...表示，12345;1,2,3...14,15  		opts.hasOwnProperty('pagingDiv')	  
		},
		setting: function (opts) {
			var that = this;
			this.init();
			if (opts&&opts.pagingDiv) that.pagingDiv = opts.pagingDiv;
            if (opts&&opts.pageNo) that.pageCurrent = opts.pageNo;
            if (opts&&opts.pageSize) that.pageSize = opts.pageSize;
            if (opts&&opts.totalCount) that.totalCount = opts.totalCount;
            if (opts&&opts.callback) that.callback = opts.callback;
			that.pageCurrent = that.pageCurrent > that.totalCount?1:that.pageCurrent;
			that.pageCount = Math.ceil(that.totalCount / that.pageSize) === 0 ? 1:Math.ceil(that.totalCount / that.pageSize);  

		},		
		render: function(obj) {
			
        	//重置原有样式 
        	this.pagingDiv.empty();
        	this.setting(obj);     
	        //创建ul，前一页标签，后一页标签
	        var that  = this,
	        	item  = that._skin.item,
	        	ellipsis = that._skin.ellipsis,
	        	first = that._skin.first,
	        	last  = that._skin.last,
	        	$wrap  = $(that._skin.wrap),
	        	firstPage = that._skin.firstPage,
	        	lastPage = that._skin.lastPage,
	        	gotoInput = that._skin.gotoInput,
	        	goBtn = that._skin.goBtn,
	        	$msg = $(that._skin.message);

	        $wrap.append(firstPage);
			$wrap.append(first); 
			// 总页数小于max，显示max以内所有值
			if (this.pageCount < this.max) {
				for(var i = 1;i <= this.pageCount;i++) {
	        		$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
	        	}
			// 总页数大于max
			}else { 
				// 当前页小于max的一半，分页条数值不变
				if(this.pageCurrent <= Math.ceil(this.max/2)) {
		        	for(var i = 1;i <= this.max;i++) {
		        		// 预留第max-1个位置来放... 最后一个位置放总页数
		        		if(i < this.max-1) {
		        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
		        		}else if(i === this.max-1) {
		        			$wrap.append(ellipsis);
		        		}else {
		        			$wrap.append(item.replace('{page2}', this.pageCount).replace('{page1}', this.pageCount));
		        		}
		        	}
		        //	当前页大于max的一半，开始改变分页条数值
		        }else {
		        	// 当前页距离最后一页超过max的一半，继续改变分页条的数值
		        	var theMax = this.pageCurrent - Math.floor(this.max/2) + this.max;
		        	if (theMax <= this.pageCount) {
		        		for(var i = this.pageCurrent - Math.floor(this.max/2);
			        	i < theMax;
			        	i++) {
		        			// 预留 第theMax-2个位子来放。。。
		        			if(i < theMax-2) {
			        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
			        		}else if(i === theMax-2) {
			        			$wrap.append(ellipsis);
			        		}else {
			        			$wrap.append(item.replace('{page2}', this.pageCount).replace('{page1}', this.pageCount));
			        		}	         									
						}
		        	// 当前页距离最后一页小于max的一半，不再改变分页条的数值
		        	}else {		        		
		        		for (var i = this.pageCount - this.max + 1;i <= this.pageCount; i++ ) {
			        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));			        
		        		}
		        	}
		        	
		        } 
			}
	        //生成html
	        $wrap.append(last);
	        $wrap.append(lastPage);
	        $wrap.append(gotoInput);
	        $wrap.append(goBtn);
	        // 生成提示信息
			$msg.text('共'+ that.totalCount+'条，每页显示'+that.pageSize+'条');
	        this.pagingDiv.append($msg);
	        this.pagingDiv.append($wrap);

	        this.addActive.call(this);
	        this.disabled.call(this); 
	        this.click.call(this); 
//	      	this.hideWithNoData();
	    },
	    addActive: function () {
	    	var that = this;
	    	//移除active
            var $active = that.pagingDiv.find($("."+that._skin.activeClass));  
            $active.removeClass(that._skin.activeClass);            
            // 找到当前的标签，添加active
	    	this.pagingDiv.find("a")
	    	.filter(function(index) {
	    		if($(this).attr('data-page') == that.pageCurrent)
	    		return $(this);
	    	})
	    	.parent()
	    	.addClass(this._skin.activeClass);
	    },
	    disabled: function () {
	    	var that = this;
	    	if(this.pageCurrent == 1) {
	    		getariaLabel('Previous');
		    	getariaLabel('firstPage');		
	    	}
	    	if(this.pageCurrent == this.pageCount) {
	    		getariaLabel('Next');
	    		getariaLabel('lastPage');	
	    	}
	    	function getariaLabel(str) {
	    		that.pagingDiv.find("a")
		    	.filter(function(index) {
		    		if($(this).attr('aria-label') == str)
		    		return $(this);
		    	})
		    	.parent()
		    	.addClass(that._skin.disabledClass)
		    	.attr('disabled', 'true');
	    	}
	    },
	    click: function() {
	        var that = this;
	        var $liPage = this.pagingDiv.find("li");

	        $liPage.click(function(event) {
	  
	            // 点击数字切换页面
	            var currentNum = $(event.target).attr("data-page");
	            if(currentNum!== undefined && currentNum != that.pageCurrent) {
	            	that.pageCurrent = currentNum;
	            	that.callback(that.pageCurrent,that.pageSize);
					//that.render();
	            }
	               
	            //非数字页面，首页，尾页等；
	            var currentNoNum = $(event.target).attr("aria-label");
	            if(currentNoNum) {
	            	switch (currentNoNum) {
		            	case "Next":
		 					if(that.pageCurrent < that.pageCount) {
		 						that.pageCurrent ++;
		 						that.callback(that.pageCurrent,that.pageSize);
		        				//that.render(); 
		 					}		
		            		break;
		            	case "Previous":
		            		if(that.pageCurrent > 1) {
		            			that.pageCurrent --;
		            			that.callback(that.pageCurrent,that.pageSize);
		        				//that.render();
		            		}	            		
		            		break;
		            	case "firstPage":
		            		if(that.pageCurrent !== 1) {
		            			that.pageCurrent = 1;
		            			that.callback(that.pageCurrent,that.pageSize);
	        					//that.render();
		            		}	            		
		            		break;
		            	case "lastPage":
		            		if(that.pageCurrent !== that.pageCount) {
		            			that.pageCurrent = that.pageCount;
			            		that.callback(that.pageCurrent,that.pageSize);
		        				//that.render();
		            		}	            		
		            		break;
		            	case "goBtn":
		            		var inputPage = $("#gotoPage").val(),
		            			regNum = /^[1-9]+[0-9]*$/;
		            		// 如果输入的是数字就执行跳转
		            		if(regNum.test(inputPage)) {
		            			if(inputPage > that.pageCount) {
			            			that.pageCurrent = that.pageCount;
			            		}else if(inputPage < 1) {
			            			that.pageCurrent = 1;
			            		}else {
			            			that.pageCurrent = +inputPage;
			            		}	            		
			            		that.callback(that.pageCurrent,that.pageSize);
		        				//that.render();
		            		}	            		
		            		break;			
		            	default:
		            		break;
	            	}
	            } 
	            

	            //阻止默认行为
	            event.preventDefault(); 
	            //回调  
	              
	        });
	            
	    },
	    //没有数据就隐藏
	    hideWithNoData:function () {
	    	if(typeof this.totalCount !== 'number' || this.pageCount < 1) {
    		this.pagingDiv.hide();
	    		
	    	}
	    },
	    showMsg: function (argument) {
	    	 /* body... */ 
	    }
	};
	paging.init();
	ui.paging = paging;
})(window.jsfund.ui = window.jsfund.ui || {});

/*var lxy = {};
(function (ui) {
	var paging = {
		_skin: {
            wrap  : '<ul class="pagination"></ul>',
            first : '<li><a href="#" aria-label="Previous">上一页</a></li>',
            last  : '<li><a href="#" aria-label="Next">下一页</a></li>',
            firstPage  : '<li><a href="#" aria-label="firstPage">首页</a></li>',
            lastPage  : '<li><a href="#" aria-label="lastPage">尾页</a></li>',
            item  : '<li><a href="#" data-page="{page1}">{page2}</a></li>',
            gotoInput : '<li style="margin:0 10px; "><input style="width:40px; height:32px" id="gotoPage" type="num" ></li>',
            goBtn: '<li><a style="float:none" href="#" aria-label="goBtn">Go</a></li>',
            disabledClass: "disabled",
            activeClass  : "active",
            ellipsis: '<li><a href="#" aria-label="ellipsis">...</a></li>',
            message: '<span style="float: left;margin-right:10px; line-height:32px; color:#999" ></span>'
        },
		init: function() {
			this.pagingDiv = $();
    		this.ul = this._skin.wrap;
			this.totalCount = 0;
	        this.pageCurrent = 1;
	        this.pageSize = 1;
	        this.pageCount = 10;   //一共分多少页
	        this.callback = function(){};
	        this.max = 7 ;//最多显示7页，中间的用...表示，12345;1,2,3...14,15  		opts.hasOwnProperty('pagingDiv')	  
		},
		setting: function (opts) {
			var that = this;
			this.totalCount = 0;
			if (opts&&opts.pagingDiv) that.pagingDiv = opts.pagingDiv;
            if (opts&&opts.pageNo) that.pageCurrent = opts.pageNo;
            if (opts&&opts.pageSize) that.pageSize = opts.pageSize;
            if (opts&&opts.totalCount) that.totalCount = opts.totalCount;
            if (opts&&opts.callback) that.callback = opts.callback;
			that.pageCurrent = that.pageCurrent > that.totalCount?1:that.pageCurrent;
			that.pageCount = Math.ceil(that.totalCount / that.pageSize) === 0 ? 1:Math.ceil(that.totalCount / that.pageSize);  

		},		
		render: function(obj) {
			
        	//重置原有样式 
        	this.pagingDiv.empty();
        	this.setting(obj);     
	        //创建ul，前一页标签，后一页标签
	        var that  = this,
	        	item  = that._skin.item,
	        	ellipsis = that._skin.ellipsis,
	        	first = that._skin.first,
	        	last  = that._skin.last,
	        	$wrap  = $(that._skin.wrap),
	        	firstPage = that._skin.firstPage,
	        	lastPage = that._skin.lastPage,
	        	gotoInput = that._skin.gotoInput,
	        	goBtn = that._skin.goBtn,
	        	$msg = $(that._skin.message);

	        $wrap.append(firstPage);
			$wrap.append(first); 
			// 总页数小于max，显示max以内所有值
			if (this.pageCount < this.max) {
				for(var i = 1;i <= this.pageCount;i++) {
	        		$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
	        	}
			// 总页数大于max
			}else { 
				// 当前页小于max的一半，分页条数值不变
				if(this.pageCurrent <= Math.ceil(this.max/2)) {
		        	for(var i = 1;i <= this.max;i++) {
		        		// 预留第max-1个位置来放... 最后一个位置放总页数
		        		if(i < this.max-1) {
		        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
		        		}else if(i === this.max-1) {
		        			$wrap.append(ellipsis);
		        		}else {
		        			$wrap.append(item.replace('{page2}', this.pageCount).replace('{page1}', this.pageCount));
		        		}
		        	}
		        //	当前页大于max的一半，开始改变分页条数值
		        }else {
		        	// 当前页距离最后一页超过max的一半，继续改变分页条的数值
		        	var theMax = this.pageCurrent - Math.floor(this.max/2) + this.max;
		        	if (theMax <= this.pageCount) {
		        		for(var i = this.pageCurrent - Math.floor(this.max/2);
			        	i < theMax;
			        	i++) {
		        			// 预留 第theMax-2个位子来放。。。
		        			if(i < theMax-2) {
			        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));
			        		}else if(i === theMax-2) {
			        			$wrap.append(ellipsis);
			        		}else {
			        			$wrap.append(item.replace('{page2}', this.pageCount).replace('{page1}', this.pageCount));
			        		}	         									
						}
		        	// 当前页距离最后一页小于max的一半，不再改变分页条的数值
		        	}else {		        		
		        		for (var i = this.pageCount - this.max + 1;i <= this.pageCount; i++ ) {
			        			$wrap.append(item.replace('{page2}', i).replace('{page1}', i));			        
		        		}
		        	}
		        	
		        } 
			}
	        //生成html
	        $wrap.append(last);
	        $wrap.append(lastPage);
	        $wrap.append(gotoInput);
	        $wrap.append(goBtn);
	        // 生成提示信息
			$msg.text('共'+ that.totalCount+'条，每页显示'+that.pageSize+'条');
	        this.pagingDiv.append($msg);
	        this.pagingDiv.append($wrap);

	        this.addActive.call(this);
	        this.disabled.call(this); 
	        this.click.call(this); 
//	      	this.hideWithNoData();
	    },
	    addActive: function () {
	    	var that = this;
	    	//移除active
            var $active = that.pagingDiv.find($("."+that._skin.activeClass));  
            $active.removeClass(that._skin.activeClass);            
            // 找到当前的标签，添加active
	    	this.pagingDiv.find("a")
	    	.filter(function(index) {
	    		if($(this).attr('data-page') == that.pageCurrent)
	    		return $(this);
	    	})
	    	.parent()
	    	.addClass(this._skin.activeClass);
	    },
	    disabled: function () {
	    	var that = this;
	    	if(this.pageCurrent == 1) {
	    		getariaLabel('Previous');
		    	getariaLabel('firstPage');		
	    	}
	    	if(this.pageCurrent == this.pageCount) {
	    		getariaLabel('Next');
	    		getariaLabel('lastPage');	
	    	}
	    	function getariaLabel(str) {
	    		that.pagingDiv.find("a")
		    	.filter(function(index) {
		    		if($(this).attr('aria-label') == str)
		    		return $(this);
		    	})
		    	.parent()
		    	.addClass(that._skin.disabledClass)
		    	.attr('disabled', 'true');
	    	}
	    },
	    click: function() {
	        var that = this;
	        var $liPage = this.pagingDiv.find("li");

	        $liPage.click(function(event) {
	  
	            // 点击数字切换页面
	            var currentNum = $(event.target).attr("data-page");
	            if(currentNum!== undefined && currentNum != that.pageCurrent) {
	            	that.pageCurrent = currentNum;
	            	that.callback(that.pageCurrent,that.pageSize);
					that.render();
	            }
	               
	            //非数字页面，首页，尾页等；
	            var currentNoNum = $(event.target).attr("aria-label");
	            if(currentNoNum) {
	            	switch (currentNoNum) {
		            	case "Next":
		 					if(that.pageCurrent < that.pageCount) {
		 						that.pageCurrent ++;
		 						that.callback(that.pageCurrent,that.pageSize);
		        				that.render(); 
		 					}		
		            		break;
		            	case "Previous":
		            		if(that.pageCurrent > 1) {
		            			that.pageCurrent --;
		            			that.callback(that.pageCurrent,that.pageSize);
		        				that.render();
		            		}	            		
		            		break;
		            	case "firstPage":
		            		if(that.pageCurrent !== 1) {
		            			that.pageCurrent = 1;
		            			that.callback(that.pageCurrent,that.pageSize);
	        					that.render();
		            		}	            		
		            		break;
		            	case "lastPage":
		            		if(that.pageCurrent !== that.pageCount) {
		            			that.pageCurrent = that.pageCount;
			            		that.callback(that.pageCurrent,that.pageSize);
		        				that.render();
		            		}	            		
		            		break;
		            	case "goBtn":
		            		var inputPage = $("#gotoPage").val(),
		            			regNum = /^[1-9]+[0-9]*$/;
		            		// 如果输入的是数字就执行跳转
		            		if(regNum.test(inputPage)) {
		            			if(inputPage > that.pageCount) {
			            			that.pageCurrent = that.pageCount;
			            		}else if(inputPage < 1) {
			            			that.pageCurrent = 1;
			            		}else {
			            			that.pageCurrent = +inputPage;
			            		}	            		
			            		that.callback(that.pageCurrent,that.pageSize);
		        				that.render();
		            		}	            		
		            		break;			
		            	default:
		            		break;
	            	}
	            } 
	            console.log(currentNoNum);
	            

	            //阻止默认行为
	            event.preventDefault(); 
	            //回调  
	              
	        });
	            
	    },
	    //没有数据就隐藏
	    hideWithNoData:function () {
	    	console.log(typeof this.totalCount);
	    	console.log(this.pageSize);
	    	console.log(this.pageCount);
	    	if(typeof this.totalCount !== 'number' || this.pageCount < 1) {
    		this.pagingDiv.hide();
	    		
	    	}
	    },
	    showMsg: function (argument) {
	    	 /* body... */ 
// 	    }
// 	};
// 	paging.init();
// 	ui.paging = paging;
// })(window.lxy.ui = window.lxy.ui || {});