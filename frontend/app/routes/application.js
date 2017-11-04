import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  cable: Ember.inject.service(''),
  subscription:null,
  beforeModel() {
    if(this.get('session.isAuthenticated')){
      let consumer = this.get('cable').createConsumer('ws://localhost:3000/cable?token='+this.get('session.data.authenticated.token'));
      let _this = this;
      this.subscription = consumer.subscriptions.create({ channel: "GameChannel", id: this.get('session.data.authenticated.id') }, {
        connected() {
        },
        received(data) {
          if(data.action == 'new_game'){
            _this.controller.set('notification','You have a new game request from '+ data.name);
            _this.controller.set('game_id',data.game_id);
            Ember.run.later( () => {
              _this.controller.set('notification',null);
            }, 300000); // 5 min
          }else{
            _this.controller.set('notification',null);
          }
          data.subscription = _this.subscription;
          _this.controllerFor('games').send('getData',data);
        },
        disconnected() {
        }
      })
    }
  },

  actions: {

    gotoGamePage(game_id){
      this.transitionTo('games', game_id);
      this.get('subscription').perform('start_game', {'game_id': game_id });
    },
    cancelGame() {
      this.controller.set('notification',null);
    },
  }
});