import EmberComponent from '@ember/component';
import { inject as service } from "@ember/service";
import layout from '../templates/components/history';
import { action, computed } from '@ember/object';

import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz/models/drawableclazzcommunication';

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

    } else if(highlightedEntity instanceof Clazz) {
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory');
      let historyEntry = latestHistory[highlightedEntity.get('fullQualifiedName')];

      if(historyEntry) {
        histories.push({name: highlightedEntity.get('name'), historyEntry: historyEntry});
      }

      return histories;
    }
    return null;
  }

  @computed('highlighter.highlightedEntity', 'landscapeRepo.latestHistory')
  get communicationHistory() {
    let latestHistory;
    this.get('landscapeRepo.latestHistory.communicationHistory').then((lh) => {latestHistory = ls});
    let highlightedEntity = this.get('highlighter.highlightedEntity');

    if(highlightedEntity instanceof Clazz) {
      let histories;

      latestHistory.forEach((historyEntry) => {
        if(historyEntry.get('sourceClazz') == highlightedEntity.get('fullQualifiedName')
          || historyEntry.get('targetClazz') == highlightedEntity.get('fullQualifiedName')) {

          const name = historyEntry.get('sourceClazz') + " -> " + historyEntry.get('targetClazz');
          histories.push({name: name, historyEntry: historyEntry.get('history')});
        }
      });

    } else if(highlightedEntity instanceof DrawableClazzCommunication) {
      let histories;

      latestHistory.forEach((historyEntry) => {
        if(historyEntry.get('sourceClazz') == highlightedEntity.get('sourceClazz.fullQualifiedName')
          && historyEntry.get('targetClazz') == highlightedEntity.get('targetClazz.fullQualifiedName')) {

            const name = highlightedEntity.get('sourceClazz.fullQualifiedName') + " -> " + highlightedEntity.get('targetClazz.fullQualifiedName');
            histories.push({name: name, historyEntry: historyEntry.get('history')});
          }
      });
    }
  return null;
  }

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
