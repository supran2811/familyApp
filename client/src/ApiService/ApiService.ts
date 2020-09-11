class ApiService {
  static async get(url: string) {
    return await ApiService.makeAPICall(url, 'get', null);
  }
  static async post(url: string, body: Object) {
    return await ApiService.makeAPICall(url, 'post', body);
  }
  static async del(url: string, body: Object) {
    return await ApiService.makeAPICall(url, 'delete', body);
  }
  static async put(url: string, body: Object) {
    return await ApiService.makeAPICall(url, 'put', body);
  }

  private static async makeAPICall(
    url: string,
    method: string,
    body: Object | null
  ) {
    const response = await fetch(url, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  }
}

export default ApiService;
