import Ember from 'ember';  
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  model() {
    return this.store.createRecord('user');
  },
  actions: {
    save(newUser){
      newUser.save().catch((error) => {
        this.controller.set('errorMessage', error)
      })
      .then(()=>{  
        this.get('session')
        .authenticate('authenticator:devise',    
          newUser.get('email'), newUser.get('password'))
        .then(() => {
          this.transitionTo('users');
        })
        .catch((reason) => {
          this.controller.set('errorMessage', reason.error ||reason);
        });
      })
    }
  }

});