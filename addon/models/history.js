import DS from 'ember-data';
const { attr, hasMany } = DS;
import CommunicationHistory from './communication-history';

export default class History extends DS.Model {
  @attr() componentHistory!: any;
  @attr() clazzHistory!: any;
  @hasMany('communication-history') communicationHistory!: CommunicationHistory;
}
