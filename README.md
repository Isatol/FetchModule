# FetchModule

A module for making HTTP requests based on fetch.

## Installation

```sh
npm install @isatol/fetchmodule
```

## Use

You need to import the ```request``` method to make requests.

Also included is support for creating an instance of a Base URL and headers to reuse them in all requests.

### Import methods

```javascript
import { createInstance, useWithHeaders, request } from "@isatol/fetchmodule";
```

- With `createInstance()` you can pass as an argument a URI address that will be the basis for subsequent requests

```javascript
createInstance("https://reqres.in/api/");
```

- With `useWithHeaders()` you can pass as an argument the initial headers for all request

```javascript
const headers = new Headers();
headers.append("Content-Type", "application/json");
useWithHeaders(headers);
```

- With `request()` you can make HTTP request. If `createInstance()` is active, just complete the rest of the URI what do you want to access.

```javascript
- With createInstance()
request("users", {
  method: "get",
});
- Without createInstance()
request("https://reqres.in/api/users", {
  method: "get",
});
```

The second argument what receive `request()` is called `options`, which is a series of options to complete the request.

```javascript
request("users", {
  method: "" -> "get, post, put, delete, patch",
  data: JSON.stringify({}) -> use it when the method is different from "get",
  headers: {} -> If `useWithHeaders()` is active, this part is autocomplete,
  params: {} -> Use it when the method is "get",
  result: "" -> The value when te promise is resolved. "json, arrayBuffer, blob, text". Default is "json",
  retry: {
    retryOn: [], -> Status Code
    redirectToPageIfFails: "" -> If a retry fails, it automatically redirects to that page
  } -> Retry requests
})
```

#### Example

```javascript
request("users", {
  method: "get",
  params: {
    page: 2,
  },
}).then((response) => {
  const data = response.data; <- represent the data returned by the server.
  const default = response.default; <- represent the Response object returned by fetch;
  const status = response.status <- represent the status code;
  this.total = response.data.total;
});
```

### Retry requests

You can also retry a request once, if the server returned an unsuccessful status code


To do so, you need to add the ```retry``` object that includes the ```retryOn```n and ```redirectToPageIfFails``` objects.

```retryOn``` it is a numeric array, here put the status codes.

```redirectToPageIfFails``` automatically redirects to a page if the retry fails. Can be omitted
#### Example

```javascript
request("users", {
  method: "post",
  retry: {
    retryOn: [401, 403],
    redirectToPageIfFails: "/"
  },
  data: JSON.stringify(jsonPost)
})
```