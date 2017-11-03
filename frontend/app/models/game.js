import DS from 'ember-data';

export default DS.Model.extend({
	user_id: DS.attr('string'),
	opponent_id: DS.attr('string'),
  winner_id: DS.attr('string'),
  status: DS.attr('string'),
  total_game:DS.attr('string'),
  total_draw:DS.attr('string'),
  user_win:DS.attr('string'),
  opponent_win:DS.attr('string'),

  user: DS.belongsTo('user'),
  opponent: DS.belongsTo('user'),
  winner: DS.belongsTo('user'),
});