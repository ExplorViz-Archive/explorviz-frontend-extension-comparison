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
      // get all contained components
      const components = highlightedEntity.getAllComponents();
      components.push(highlightedEntity);

      const histories = [];
      // load the history for the current application
      const latestHistory = this.get('landscapeRepo.latestHistory.componentHistory.' + applicationName);
      const self = this;

      components.forEach((component) => {
        // check for a history entry with the component name
        const historyEntry = latestHistory[component.get('fullQualifiedName')];

        if(historyEntry) {
          // push the history entry together with the component name
          histories.push({name: component.get('name'), historyEntry: self.convertHistoryEntry(historyEntry)});
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
      const clazzes = highlightedEntity.getAllClazzes();

      const histories = [];
      const latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory.' + applicationName);
      const self = this;

      clazzes.forEach((clazz) => {
        let historyEntry = latestHistory[clazz.get('fullQualifiedName')];

        if(historyEntry) {
          histories.push({name: clazz.get('name'), historyEntry: self.convertHistoryEntry(historyEntry)});
        }
      });

      return histories;

    } else if(highlightedEntity instanceof Clazz) {
      const histories = [];
      const latestHistory = this.get('landscapeRepo.latestHistory.clazzHistory.' + applicationName);
      const historyEntry = latestHistory[highlightedEntity.get('fullQualifiedName')];
      const self = this;

      // just check if the single clazz has an entry
      if(historyEntry) {
        histories.push({name: highlightedEntity.get('name'), historyEntry: self.convertHistoryEntry(historyEntry)});
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
      const histories = [];
      const self = this;

      latestHistory.forEach((historyEntry) => {
        // check if either the source clazz or target clazz of the history history entry
        // is currently selected; also check for the correct application
        if((historyEntry.get('sourceClazz') == highlightedEntity.get('fullQualifiedName')
          || historyEntry.get('targetClazz') == highlightedEntity.get('fullQualifiedName'))
          && historyEntry.get('application') == applicationName) {

          const sourceName = historyEntry.get('sourceClazz');
          const targetName = historyEntry.get('targetClazz');

          // get the name of the source and target clazzes from the full qualified name
          const name = sourceName.substring(sourceName.lastIndexOf('.') + 1, sourceName.length - 1)
            + " -> " + targetName.substring(targetName.lastIndexOf('.') + 1, targetName.length - 1);

          histories.push({name: name, historyEntry: self.convertHistoryEntry(historyEntry.get('history'))});
        }
      });

      return histories;

    } else if(highlightedEntity instanceof DrawableClazzCommunication) {
      const histories = [];
      const self = this;

      latestHistory.forEach((historyEntry) => {
        // check if the currently selected communication is this histroy entry
        if(historyEntry.get('sourceClazz') == highlightedEntity.get('sourceClazz.fullQualifiedName')
          && historyEntry.get('targetClazz') == highlightedEntity.get('targetClazz.fullQualifiedName')
          && historyEntry.get('application') == applicationName) {

            const name = highlightedEntity.get('sourceClazz.name') + " -> " + highlightedEntity.get('targetClazz.name');
            histories.push({name: name, historyEntry: self.convertHistoryEntry(historyEntry.get('history'))});
          }
      });

      return histories;
    }
  return null;
  }

  convertHistoryEntry(historyEntry) {
    const convertedHistoryEntry = {};

    // convert every timestamp into a human readable string
    Object.entries(historyEntry).forEach((entry) => {
      const date = new Date(parseInt(entry[0]));
      convertedHistoryEntry[date] = entry[1];
    });

    return convertedHistoryEntry;
  }

  @action
  close() {
    this.get('additionalData').removeComponent('history');
  }
};
