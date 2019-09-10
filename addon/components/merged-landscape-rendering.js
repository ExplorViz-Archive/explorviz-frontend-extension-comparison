import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/merged-landscape-rendering';
import {inject as service} from '@ember/service'

export default LandscapeRendering.extend({
	layout,
	landscapeRepo: service('merged-landscape-repository'),

	createPlane(model) {
    const emberModelName = model.constructor.modelName;
		if(emberModelName == 'application') {
				console.log(model);
		}

    const material = new THREE.MeshBasicMaterial({
      color: this.get('configuration.landscapeColors.' + emberModelName)
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(model.get('width'),
      model.get('height')), material);

    plane.userData['model'] = model;
    return plane;
  }
});
