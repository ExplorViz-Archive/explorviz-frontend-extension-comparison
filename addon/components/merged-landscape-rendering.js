import LandscapeRendering from 'explorviz-frontend/components/visualization/rendering/landscape-rendering';
import layout from '../templates/components/merged-landscape-rendering';
import {inject as service} from '@ember/service'

export default LandscapeRendering.extend({
	layout,
	landscapeRepo: service('merged-landscape-repository')
});
