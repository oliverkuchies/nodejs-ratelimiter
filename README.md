# Rate Limiter for NodeJS

This is a middleware that supports Rate Limiting in NodeJS.

Usage:

app.use(rateLimiter);

Rate limits are configurable in the config file. The default configuration is as follows:

```json
{
  "rateLimits": [
    {
      "requestsAllowed": 5,
      "routeRegex": "/api/*",
      "windowSeconds": 60
    },
    {
      "requestsAllowed": 1,
      "routeRegex": "/admin/*",
      "windowSeconds": 60
    }
  ]
}
```

The above configuration allows 5 requests per minute for all routes starting with /api/ and 1 request per minute for all routes starting with /admin/.

The rate limiter uses a sliding window algorithm to track the number of requests made in the last windowSeconds seconds. If the number of requests exceeds requestsAllowed, a 429 Too Many Requests response is sent.

Sorted sets in Redis are utilised to automatically expire keys after windowSeconds seconds, and to keep track of the number of requests made in the last windowSeconds seconds.

The rate limiter is tested in Jest, and can be run using the command `npm test`. This will create multiple Docker 
containers to establish the environment.

To run the environment, a user should run make start, which will start the MySQL instance, Redis server and the NodeJS 
server. 

The server will be running on port 3000.

