import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  confirmationMessage: 'Are you sure?',
  session: Ember.inject.service(),
  model(params) {
    return this.store.findRecord('game',params.game_id);
  },
  actions: {
    restartGame() {
      let user = this.get('session.data.authenticated.id');
      let opponent = '';
      const game = this.controller.get('model');
      if(user == game.data.user_id){
        opponent = game.data.opponent_id;
      }else{
        opponent = game.data.user_id;
      }

      const newGame = this.store.createRecord('game',{
        user_id: user,
        opponent_id: opponent,
      });
      newGame.save().then((res) => {
        var controller = this.controllerFor('games');
        controller.send('clearBoard');
        this.transitionTo('games',res.id);
      })
    },

    willTransition(transition) {
      let game_id = this.controller.get('game_id');
      this.store.findRecord('game',game_id).then( (res) => {
        if(res.data.status == 'in_process'){
          let confirmation = confirm("If you leave this page your opponent won the game. Would you like to leave this game?");

          if (confirmation) {
            var controller = this.controllerFor('games');
            controller.send('withdrawGame');
          } else {
            transition.abort();
          }
        }
      });
    }
  }
});
