import Component from '@ember/component';
import layout from '../templates/components/status-filter';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service'

export default class StatusFilter extends Component {
  layout = layout;
  tagName = '';

  @service('comparison-configuration')
  configuration!: Configuration;

  @service('rendering-service')
  renderingService!: renderingService;

  @action
  toggleAddedButton() {
    const property = 'configuration.comparisonToggle.added';

    this.set(property, !this.get(property));
    this.get('renderingService').redrawScene();
  }

  @action
  toggleDeletedButton() {
    const property = 'configuration.comparisonToggle.deleted';

    this.set(property, !this.get(property));
      this.get('renderingService').redrawScene();
  }

  @action
  toggleOriginalButton() {
    const property = 'configuration.comparisonToggle.original';

    this.set(property, !this.get(property));
      this.get('renderingService').redrawScene();
  }
}
