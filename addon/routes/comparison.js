import BaseRoute from 'explorviz-frontend/routes/base-route';

export default BaseRoute.extend({
	model() {
		return {test: 'Button'};
	},

	actions: {

		// @Override BaseRoute
		resetRoute() {
			this.controller.send('resetView');
			this.controller.set('landscapeRepo.latestApplication', null);
		},

		// @Override
		didTransition() {
			this.controller.hideVersionbar();
			this.controller.showTimeline();
		}
	}
});
