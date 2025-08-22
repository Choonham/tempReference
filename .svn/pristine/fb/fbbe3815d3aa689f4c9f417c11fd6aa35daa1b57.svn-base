

const baseUrl = "http://192.168.10.220/data/";

const apiCall = async(options) => {
  let query = new URLSearchParams(options.query || {}).toString();
  if (query !== '') {
    query = '?' + query;
  }
  let response;
  try {
    response = await fetch(baseUrl + options.url + query, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });
  }
  catch (error) {
    response = {
      ok: false,
      status: 500,
      json: async () => { return {
        code: 500,
        message: 'The server is unresponsive',
        description: error.toString(),
      }; }
    };
  }

 
  return {
    ok: response.ok,
    status: response.status,
    body: response.status !== 204 ? await response.json() : null
  };  
}

const httpGet = (url, query, options) => {
  return apiCall({method: 'GET', url, query, ...options});
}

const httpPost = async (url, body, options) => {
  return apiCall({method: 'POST', url, body, ...options});
}

const httpPut = async (url, body, options) => {
  return apiCall({method: 'PUT', url, body, ...options});
}

const httpDelete = async (url, options) => {
  return this.request({method: 'DELETE', url, ...options});
} 


/** User Simulator List
* @param {String} _userNo UserNo
* @param {String} _userId UserID
 * @param {String} _userGrade UserGrade 
 * @returns {obj} {"list":[{"simulatorID":1,"simulatorName":"simulator1"}],"totalCount":1}
 */
export const userSimulatorList = (_userNo,_userId, _userGrade) => {    
  return httpGet("/userSimulatorList", {UserNo: _userNo, UserID : _userId , UserGrade: _userGrade});
};


/** User Login
 * @param {String} _loginId UserID
 * @param {String} _loginPw UserPW 
 * @returns {obj} {"userInfo":{"UserNo":"1","UserName":"simulator1","UserID":"simulator1","Grade":"M"},"success":true} 
 */
export const userLogin = (_loginId, _loginPw) => {    
  return httpGet("/userLogin", {LoginID : _loginId , LoginPW: _loginPw});
};
