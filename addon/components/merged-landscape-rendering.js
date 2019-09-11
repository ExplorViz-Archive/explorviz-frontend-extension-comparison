import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/merged-landscape-rendering';
import {inject as service} from '@ember/service'

export default LandscapeRendering.extend({
	layout,
	landscapeRepo: service('merged-landscape-repository'),
	comparisonConfiguration: service('comparison-configuration'),

	createPlane(model) {
    const emberModelName = model.constructor.modelName;
		let color;
		const applicationStatus = model.get('extensionAttributes.status');

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
});
