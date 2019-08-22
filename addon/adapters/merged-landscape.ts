import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from 'explorviz-frontend/config/environment';

export default class MergedLandscape extends DS.JSONAPIAdapter.extend(DataAdapterMixin) {
  host = ENV.APP.API_ROOT;
  namespace = "v1/extension/comparison";

  init() {
    this.set('headers', {
      "Accept": "application/vnd.api+json"
    });
  }

  authorize(xhr) {
    let { access_token } = this.get('session.data.authenticated');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    'merged-landscape': MergedLandscape;
  }
}
