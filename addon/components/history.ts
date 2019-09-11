import EmberComponent from '@ember/component';
import { inject as service } from "@ember/service";
import layout from '../templates/components/history';
import { action, computed } from '@ember/object';

import Component from 'explorviz-frontend/models/component';
import Clazz from 'explorviz-frontend/models/clazz';
import DrawableClazzCommunication from 'explorviz-frontend/models/drawableclazzcommunication';

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
    const highlightedEntity = this.get('highlighter.highlightedEntity');
    const applicationName = this.get('landscapeRepo.latestApplication.name');

    if(highlightedEntity instanceof Component) {
      let components = highlightedEntity.getAllComponents();
      components.push(highlightedEntity);
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.componentHistory.' + applicationName);

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
    const highlightedEntity = this.get('highlighter.highlightedEntity');
    const applicationName = this.get('landscapeRepo.latestApplication.name');

    if(highlightedEntity instanceof Component) {
      let clazzes = highlightedEntity.getAllClazzes();
      let histories = [];
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory.' + applicationName);

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
      let latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory.' + applicationName);
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
    const latestHistory = this.get('landscapeRepo.latestHistory.communicationHistory');
    const highlightedEntity = this.get('highlighter.highlightedEntity');
    const applicationName = this.get('landscapeRepo.latestApplication.name');

    if(highlightedEntity instanceof Clazz) {
      let histories = [];

      latestHistory.forEach((historyEntry) => {
        console.log([historyEntry.get('application'), applicationName]);
        if((historyEntry.get('sourceClazz') == highlightedEntity.get('fullQualifiedName')
          || historyEntry.get('targetClazz') == highlightedEntity.get('fullQualifiedName'))
          && historyEntry.get('application') == applicationName) {

          const sourceName = historyEntry.get('sourceClazz');
          const targetName = historyEntry.get('targetClazz');

          const name = sourceName.substring(sourceName.lastIndexOf('.') + 1, sourceName.length - 1)
            + " -> " + targetName.substring(targetName.lastIndexOf('.') + 1, targetName.length - 1);
          histories.push({name: name, historyEntry: historyEntry.get('history')});
        }
      });

      return histories;

    } else if(highlightedEntity instanceof DrawableClazzCommunication) {
      let histories = [];

      latestHistory.forEach((historyEntry) => {
        console.log([historyEntry.get('application'), applicationName]);
        if(historyEntry.get('sourceClazz') == highlightedEntity.get('sourceClazz.fullQualifiedName')
          && historyEntry.get('targetClazz') == highlightedEntity.get('targetClazz.fullQualifiedName')
          && historyEntry.get('application') == applicationName) {

            const name = highlightedEntity.get('sourceClazz.name') + " -> " + highlightedEntity.get('targetClazz.name');
            histories.push({name: name, historyEntry: historyEntry.get('history')});
          }
      });

      return histories;
    }
  return null;
  }

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
