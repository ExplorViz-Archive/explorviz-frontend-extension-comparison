import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {

  host: ENV.APP.API_ROOT,
  namespace: "v1/extension/comparison",

  init() {
    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });
  },

  buildURL(modelName, id, snapshot, requestType, query) {
    const timestamps = query['timestamps'];
    const url = 'v1/extension/comparison/' + modelName + '/timestamps=' + timestamps.join('&timestamps=');
    console.log(url);
    return url;
  },

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
