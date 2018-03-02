import VisualizationNavbar from 'explorviz-frontend/components/visualization/page-setup/visualization-navbar';
import layout from '../templates/components/color-checkbox-field';
import { alias } from '@ember/object/computed';
import { observer} from '@ember/object';
import { inject as service } from "@ember/service";
import Ember from 'ember';

const {inject} = Ember;

export default VisualizationNavbar.extend({
layout,

renderingService: inject.service("rendering-service"),
configuration: service("configuration"),
toggleOriginal: alias('configuration.comparisonSettings.toggleOriginal'),
toggleAdded: alias('configuration.comparisonSettings.toggleAdded'),
toggleEdited: alias('configuration.comparisonSettings.toggleEdited'),
toggleDeleted: alias('configuration.comparisonSettings.toggleDeleted'),

toggleOriginalChanged: observer('toggleOriginal', function(){
    this.get('renderingService').redrawScene();
}),

toggleAddedChanged: observer('toggleAdded', function(){
  this.get('renderingService').redrawScene();
}),

toggleEditedChanged: observer('toggleEdited', function(){
  this.get('renderingService').redrawScene();
}),

toggleDeletedChanged: observer('toggleEdited', function(){
  this.get('renderingService').redrawScene();
}),

});
