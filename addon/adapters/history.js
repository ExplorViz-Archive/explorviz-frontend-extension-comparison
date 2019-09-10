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

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }

});
