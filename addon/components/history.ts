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
  get componentHistory() {
    let highlightedEntity = this.get('highlighter.highlightedEntity');

    if(highlightedEntity instanceof Component) {
      let components = highlightedEntity.getAllComponents();
      components.push(highlightedEntity);
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.componentHistory');

      components.forEach((component) => {
        let historyEntry = latestHistory[component.get('fullQualifiedName')];

        if(historyEntry) {
          histories.push({name: component.get('name'), historyEntry: historyEntry});
        }
      });

      return histories;
    }

    return null;
  }

  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestHistory')
  get clazzHistory() {
    let highlightedEntity = this.get('highlighter.highlightedEntity');

    if(highlightedEntity instanceof Component) {
      let clazzes = highlightedEntity.getAllClazzes();
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory');

      clazzes.forEach((clazz) => {
        let historyEntry = latestHistory[clazz.get('fullQualifiedName')];

        if(historyEntry) {
          histories.push({name: clazz.get('name'), historyEntry: historyEntry});
        }
      });

      console.log(histories);
      return histories;
    }

    if(highlightedEntity instanceof Clazz) {
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory');
      let historyEntry = latestHistory[highlightedEntity.get('fullQualifiedName')];
      let histories = [];

      if(historyEntry) {
        histories.push({name: highlightedEntity.get('name'), historyEntry: historyEntry});
      }

      return histories;
    }
    return null;
  }

  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestHistory')
  get communicationHistory() {
    console.log(this.get('landscapeRepo.latestHistory.communicationHistory'));
    this.get('landscapeRepo.latestHistory.communicationHistory').then((latestHistory) => {
      latestHistory.forEach((historyEntry) => {
        console.log([historyEntry.get('sourceClazz'), historyEntry.get('targetClazz')], historyEntry.get('history'));
      });
    });
    return true;
  }

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
