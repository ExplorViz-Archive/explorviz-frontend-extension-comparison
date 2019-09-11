import DS from 'ember-data';
const { attr } = DS;

export default class CommunicationHistory extends DS.Model{
  @attr() sourceClazz!: string;
  @attr() targetClazz!: string;
  @attr() application!: string;
  @attr() history!: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'communication-history': CommunicationHistory;
  }
}
