import DS from 'ember-data';
const { attr } = DS;

export default class History extends DS.Model {
  @attr() componentHistory!: any;
  @attr() clazzHistory!: any;

}
