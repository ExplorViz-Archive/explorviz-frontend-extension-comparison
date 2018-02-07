import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend( AuthenticatedRouteMixin, {
  actions: {
  // @Override BaseRoute -> if you change between components in your extension,
  // resetRoute (example in frontend: change between landscape and application perspective); BaseRoute.extend()

}
});
