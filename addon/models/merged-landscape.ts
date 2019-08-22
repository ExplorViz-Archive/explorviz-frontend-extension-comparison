import DS from 'ember-data';
import BaseEntity from 'explorviz-frontend/models/baseentity';
import Timestamp from 'explorviz-frontend/models/timestamp';
import Event from 'explorviz-frontend/models/event';
import ApplicationCommunication from 'explorviz-frontend/models/applicationcommunication';

const { belongsTo, hasMany } = DS;

/**
* Ember model for a landscape.
*
* @class Landscape-Model
* @extends BaseEntity-Model
*
* @module explorviz
* @submodule model.meta
*/
export default class MergedLandscape extends BaseEntity {

  @belongsTo('timestamp')
  timestamp!: DS.PromiseObject<Timestamp> & Timestamp;

  @hasMany('event', { inverse: null })
  events!: DS.PromiseManyArray<Event>;

  @hasMany('system', { inverse: 'parent' })
  systems!: DS.PromiseManyArray<Event>;

  // list of applicationCommunication for rendering purposes
  @hasMany('applicationcommunication', { inverse: null })
  totalApplicationCommunications!: DS.PromiseManyArray<ApplicationCommunication>;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'merged-landscape': MergedLandscape;
  }
}
