import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  cable: Ember.inject.service(''),
  subscription:null,
  beforeModel() {
    let consumer = this.get('cable').createConsumer('ws://localhost:3000/cable');
    let _this = this;
    this.subscription = consumer.subscriptions.create({ channel: "GameChannel", id: this.get('session.data.authenticated.id') }, {
      connected() {
      },
      received(data) {
        if(data.action == 'new_game'){
          _this.controller.set('notification','You have a new game request from '+ data.name);
          _this.controller.set('game_id',data.game_id);
        }else{
          _this.controller.set('notification',null);
        }
        data.subscription = _this.subscription;
        _this.controllerFor('games').send('getData',data);
      },
      disconnected() {
      }
    })
  },

  actions: {

    gotoGamePage(game_id){
      this.get('subscription').perform('start_game', {'game_id': game_id });
      this.transitionTo('games', game_id);
    }
  }
});