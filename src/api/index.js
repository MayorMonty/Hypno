import * as url from "url";
import request from "request";
/**
 * @class Hypno.API
 * @desc  Configure a REST API to use
 *
 * @param {Object} options - The options object
 *   @param {String} options.domain - A domain url to place in front of your endpoints
 *   @param {Object} options.endpoints - The endpoints to base the API off of
 *   @param {Object} options.headers - Additional Headers to add to each request
 *   @param {Function} options.response - Determine the status of the response
 *   @param {Object} options.auth - Authentication parameters for each request
 *     @param {String} options.auth.type - The type of authentication: "http" or "custom", for now (OAuth is planned)
 *     @param {Function} options.auth.modify - [required if type is custom] The function used to modify each request if using custom authentication
 *     @param {String} options.auth.user - [required if type is http] The HTTP Auth User
 *     @param {String} options.auth.pass - [required if type is http] The HTTP Auth Password
 */
export class API {
  constructor(options) {

    if (typeof options !== "object" || options === null || options instanceof Array)
      throw new TypeError("Hypno.API expects first parameter to be an object literal, specifying the options");

    this.options = options;

    this.options.domain = this.options.domain || "";
  }

  /**
   * @function Hypno.API.prototype.get
   * @desc Get an endpoint with given parameters
   * @memberof Hypno.API
   *
   * @param  {String} endpoint The endpoint to get
   * @param  {Object} options Any options to specify with your request
   * @return {Promise} Promise A promise which resolves upon request completion
   */
  get(endpoint, options) {
    options = options || {};
    return new Promise((function(resolve, reject) {

      if (!this.options.endpoints[endpoint])
        reject(`Unknown endpoint ${endpoint}`);

      let path = this.options.endpoints[endpoint];

      function fillparameters(match, n1) {
        let temp = options.parameters[n1];
        delete options.parameters[n1];
        return temp;
      }
      // Filter through, and remove parameters used in the endpoint text
      for (var param in options.parameters) {
        if (options.parameters.hasOwnProperty(param)) {
          if (path.includes(`%${param}%`)) {  // => It's used in endpoint text, and removed
            path = path.replace(
              new RegExp(`%(${param})%`, "g"),
              fillparameters
            );

          }

        }
      }

      // In the end, replace all remaining instances of %param% with ""
      path = path.replace(/%\w+%/g, "");

      let req = {
        "url": url.resolve(this.options.domain, path),
        "json": true,
        "headers": this.options.headers,
        "qs": options.parameters
      };
      request(req, function(err, resp) {
          if (err)
            reject(err);
          console.log("Got response");
      });


    }).bind(this)); // => Keep the class instaniation as this
  }
}
