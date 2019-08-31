import EmberComponent from '@ember/component';
import { inject as service } from "@ember/service";
import layout from '../templates/components/history';
import { action, computed } from '@ember/object';

import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';

export default class History extends EmberComponent {
  layout = layout;
  traces = [];

  @service('additional-data')
  additionalData!: AdditionalData;

  @service('visualization/application/highlighter')
  highlighter!: Highlighter;

  @service('merged-landscape-repository')
  landscapeRepo!: LandscapeRepo;

  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestHistory')
  get childHistory() {
    let highlightedEntity = this.get('highlighter.highlightedEntity');

    if(highlightedEntity instanceof Component) {
      let children = highlightedEntity.getAllComponents();
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.componentHistory');

      children.forEach((child) => {
        let historyEntry = latestHistory[child.get('fullQualifiedName')];

        if(historyEntry) {
          histories.push({name: child.get('name'), historyEntry: historyEntry});
        }
      });

      console.log(histories);
      return histories;
    }

    return null;
  }

  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestHistory')
  get clazzHistory() {
    let highlightedEntity = this.get('highlighter.highlightedEntity');

    if(highlightedEntity instanceof Component) {
      let children = highlightedEntity.getAllClazzes();
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory');

      children.forEach((child) => {
        let historyEntry = latestHistory[child.get('fullQualifiedName')];

        if(historyEntry) {
          histories.push({name: child.get('name'), history: historyEntry});
        }
      });

      console.log(histories);
      return histories;
    }
    return null;
  }

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
