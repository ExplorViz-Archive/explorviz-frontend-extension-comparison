import VisualizationRoute from 'explorviz-frontend/routes/visualization';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default VisualizationRoute.extend( AuthenticatedRouteMixin, {
//   actions: {
//   // @Override BaseRoute -> if you change between components in your extension,
//   // resetRoute (example in frontend: change between landscape and application perspective); BaseRoute.extend()
// resetRoute(){
//   visualizationController.send('resetView');
//   visualizationController.set('landscapeRepo.latestLandscape', null);
// }
// }
});
