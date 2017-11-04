import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service(),
  model(params) {
    return this.store.findRecord('game',params.game_id);
  },
  afterModel(model,transition) {
    let controller = this.controllerFor('games');
    if(model.get('status') === 'waiting')
    {
      controller.send('clearBoard');
    }else if(model.get('status') === 'in_process'){
      if(this.get('router.url') === transition.intent.url){
        this.transitionTo('users');
        controller.send('withdrawGame');
      }
    }else if(model.get('status') != 'waiting' && model.get('status') != 'in_process' ){
      this.transitionTo('users');
    }
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
      if(transition.targetName == 'games'){
        return true;
      }else{
        if (this.get('pendingTransition.targetName') == transition.targetName) {
          this.set('pendingTransition', null);
          return true;
        }
        transition.abort();
        if(this.controller.get('game_id')){
          let game_id = this.controller.get('game_id');
          this.store.findRecord('game', game_id,{ reload: true }).then((game) => {
            let status = game.get('status');
            if(status === 'in_process'){
              this.set('pendingTransition', transition);
              let confirmation = confirm("If you leave this page your opponent won the game. Would you like to leave this game?");

              if (confirmation) {
                transition.retry();
                var controller = this.controllerFor('games');
                controller.send('withdrawGame');
              } else {
                transition.abort();
              }
            }else{
              this.set('pendingTransition', transition);
              transition.retry();
            }
          });
        }else{
          this.set('pendingTransition', transition);
          transition.retry();
        }
      }
    }
  }
});
