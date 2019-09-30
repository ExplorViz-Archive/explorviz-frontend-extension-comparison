import DS from 'ember-data';
const { attr } = DS;

export default class CommunicationHistory extends DS.Model{
  @attr() sourceClazz!: string;
  @attr() targetClazz!: string;
  @attr() application!: string;
  @attr() history!: any;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'communication-history': CommunicationHistory;
  }
}
