import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/merged-landscape-rendering';
import {inject as service} from '@ember/service'

export default class MergedLandscapeRendering extends LandscapeRendering {
	layout = layout;

	@service('merged-landscape-repository')
	landscapeRepo!: MergedLandscapeRepository;

	@service('comparison-configuration')
	comparisonConfiguration!: ComparisonConfiguration;

	createPlane(model) {
    const emberModelName = model.constructor.modelName;
		let color;
		const applicationStatus = model.get('extensionAttributes.status');

		// if an application is added check the status and set the color
		// otherwise use the default behaviour of the landscape rendering
		if(emberModelName == 'application') {
			if(applicationStatus == 'ADDED') {
				color = this.get('comparisonConfiguration.mergedLandscapeColors.addedApplication');
			} else if(applicationStatus == 'DELETED') {
				color = this.get('comparisonConfiguration.mergedLandscapeColors.deletedApplication');
			} else if(applicationStatus == 'ORIGINAL') {
				color = this.get('comparisonConfiguration.mergedLandscapeColors.originalApplication');
			}
		} else {
			color = this.get('configuration.landscapeColors.' + emberModelName);
		}

    const material = new THREE.MeshBasicMaterial({
      color: color
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(model.get('width'),
      model.get('height')), material);

    plane.userData['model'] = model;
    return plane;
  }
}
