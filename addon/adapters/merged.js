import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

const { JSONAPIAdapter } = DS;

/**
* This Adapter operates as communication abstraction for all network requests,
* that refer to merged Landscape objects. It provides functions for fetching,
* updating and uploading. However, at the time of writing this documentation
* only fetching is implemented by the backend.
*
* @class Landscape-Adapter
* @extends DS.JSONAPIAdapter
*
* @module explorviz
* @submodule network
*/
export default JSONAPIAdapter.extend(DataAdapterMixin, {

  authorizer: 'authorizers:authorizers',

  host: ENV.APP.API_ROOT,
  namespace: "extension/comparison",

  headers: {
    "Accept": "application/vnd.api+json"
  },

  //@Override
  urlForQueryRecord(query) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/${query}`;
  }

});
