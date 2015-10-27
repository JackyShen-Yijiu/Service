var ServiceApi = function(){
	var that = this;
	var _targetHost = location.host;

	var _apiHost = "http://" + _targetHost + "/";
	var _authToken;
	var _webSocket;

	// do we have an existing instance?
    if (typeof ServiceApi._instance === 'object') {
        return ServiceApi._instance;
    }

	// cache
    ServiceApi._instance = this;

	that.setAuthToken = function(authToken){
		_authToken = authToken;
	};

	that.getApiHost = function(){
		return _apiHost;
	};

	that.getTargetHost = function(){
		return _targetHost;
	};

	that.getAuthToken = function(){
		return _authToken;
	};

	that.getInstance = function(){
		if (!_instance) {
            _instance = createInstance();
        }
        return _instance;
	};

	var createInstance = function() {
        var object = new ServiceApi("I am the instance");
        return object;
    };
};


ServiceApi.prototype.getQuestionList = function(callback){
	var that = this;

	var url = that.getApiHost() + "/question/questionlist";
	that.HTTPGet(url, callback);

};
