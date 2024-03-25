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

If a user wishes to create an override over an existing rate limit, they can do so by adding a new rate limit to the 

rate entity table with the same routeRegex as the existing rate limit. The new rate limit will override the existing.
You can also add an expiry to the rate limit, which will cause the rate limit to expire after the expiry time.

In the case that a developer wishes to configure rules for different groups, i.e. authenticated or unauthenticated 
users, they can use the group column to associate a route with different users.
This would then require minor adjustments around the middleware to pass the group of the user and apply the rate limit.


## Getting started

`make start` - This will start the MySQL instance, Redis server and the NodeJS 
server.

Please note, there will be a slight delay while the server waits for MySQL to boot the first time around.


TODO : Improve the rate limiter to support more than ip address, i.e. utilise their browser user-agent, referring 
domains etc. IP alone may be too restrictive to those in the home, but also allow for VPN abuse.

TODO : Add more coverage around middleware.

