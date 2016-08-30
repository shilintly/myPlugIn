/*
 * 调用方法leAjax.shippingAddress.get(data, cb, err);
 * */
var leAjax = function() {
    var url = {
        // --------xX API 地址 Xx--------
    	shippingAddress: {
            get: 'shippingaddress/get',
            showalladdress:'shippingaddress/listPage',
            deleteaddress:'shippingaddress/delete',
            addaddress:'shippingaddress/add',
            setdefault:'shippingaddress/setdefault',
            updateaddress:'shippingaddress/updatePage',
            updatebtnaddress:'shippingaddress/update',
        }
    };
    function _ajax(obj, cb, err) {
        //添加随机数
        obj.type = obj.data ? 'POST' : 'GET';
        if (obj.url.indexOf('?') > -1) {
            obj.url = obj.url + '&rnd=' + Math.random();
        } else {
            obj.url = obj.url + '?rnd=' + Math.random();
        }
        var option = {
            type: 'POST',
            dataType: 'json',
            success: function(data, textStatus, xhr) {
                var jsonData;
                try {
                    if (typeof data === 'object') {
                        jsonData = data;
                    } else {
                        jsonData = $.parseJSON(data);
                    }

                } catch (ex) {
                    console.log('json 转换 obj 失败！' + opts.url);
                    jsonData = {
                        text: data
                    };
                    console.log(xhr);
                } finally {
                    jsonData.success = typeof jsonData.success === "undefined" ? true : jsonData.success;
                }
                if (Boolean(jsonData.success) === false) {
                    // console.error('请求失败！errCode = ' + jsonData.errCode + ', msg = ' + jsonData.msg);
                    err && err(jsonData, xhr);

                } else {
                    console.log("成功" + jsonData);
                    cb && cb(jsonData, xhr);
                }

            },
            error: function(xhr, errorType, error) {
                console.error('请求失败！' + obj.url);
                console.log('errorType', errorType);
                console.log('error', error);
                err && err({
                    msg: '网络异常，请稍候再试！',
                    success: false
                }, xhr);
            }
        };
        $.extend(true, option, obj);
        return $.ajax(option);
    }
    
    function clone(obj) {
        var newObj = {};
        for( var i in obj) {
            if(typeof obj[i] === 'object') {
                newObj[i]  = clone(obj[i]);         
            }
            if(typeof obj[i] === 'string'){ 
                newObj[i] = function(url){
                	return function(_data, _cb, _err){
                		_ajax({
                            url: url,
                            data: _data,
                        }, _cb, _err);
                	};
                }(obj[i]);
            }        
        }       
        return newObj;
    }
    return clone(url);
}();