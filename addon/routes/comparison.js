import BaseRoute from 'explorviz-frontend/routes/base-route';

export default BaseRoute.extend({
	setupController(controller, model) {
		this._super(controller, model);
		//controller.initRendering();
	},

	actions: {

		// @Override BaseRoute
		resetRoute() {
			this.controller.send('resetView');
			this.controller.set('landscapeRepo.latestApplication', null);
		},

		// @Override
		didTransition() {
			this.controller.showTimeline();
		}
	}
});
