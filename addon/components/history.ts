import Component from '@ember/component';
import { inject as service } from "@ember/service";
import layout from '../templates/components/history';
import { action } from '@ember/object';

export default class History extends Component {
  layout = layout;
  traces = [];

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('visualization/application/highlighter')
  highlighter!: Highlighter;

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
