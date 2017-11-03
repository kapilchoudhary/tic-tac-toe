import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  actions: {
    authenticate(email,password) {
      this.get('session').authenticate('authenticator:devise', email, password).then(() => {
        this.transitionTo('users');
      }).catch((reason) => {
        this.controller.set('errorMessage', reason.error || reason);
      });
    }
  }
});
