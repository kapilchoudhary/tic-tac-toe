import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	session: Ember.inject.service(),
	model() {
		return this.store.findAll('user');
	},

	actions:{
		createGame(opponent){
			const game = this.store.createRecord('game',{
				user_id: this.get('session.data.authenticated.id'),
				opponent_id: opponent.id,
			});
			game.save().then((res) => {
				this.transitionTo('games',res.id);
			})
		}
	}
});

