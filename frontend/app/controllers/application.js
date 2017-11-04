import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    invalidateSession() {
      Ember.$.ajax({
        url:  '/users/'+this.get('session.data.authenticated.id')+'/offline',
        type: 'DELETE',
      });
      this.get('session').invalidate();      
    }
  }
})