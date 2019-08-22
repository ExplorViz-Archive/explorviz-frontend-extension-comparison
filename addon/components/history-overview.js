import Component from '@ember/component';
import layout from '../templates/components/history-overview';
import {inject as service} from '@ember/service';

export default Component.extend({
  layout,

  additionalData: service(),

  actions: {
    showHistory() {
      this.get('additionalData').addComponent('history');
      this.get('additionalData').openAdditionalData();
    }
  }
});
