import VisualizationNavbar from 'explorviz-frontend/components/visualization/page-setup/visualization-navbar';
import layout from '../templates/components/color-checkbox-field';
import { alias } from '@ember/object/computed';
import { observer} from '@ember/object';
import { inject as service } from "@ember/service";

/**
*Adds toggle buttons for highlighting.
* @class Color-Checkbox-Field-Component
* @extends Visualization-Navbar-Component
*/
export default VisualizationNavbar.extend({
layout,

renderingService: service("rendering-service"),
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

toggleDeletedChanged: observer('toggleDeleted', function(){
  this.get('renderingService').redrawScene();
}),

});
