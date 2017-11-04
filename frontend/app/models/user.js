import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  email:  DS.attr('string'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
  games: DS.hasMany('games', {inverse: 'user'}),
  online: DS.attr('boolean'),
  total_game:DS.attr('string'),
  total_draw:DS.attr('string'),
  total_win:DS.attr('string'),

  isNameValid: Ember.computed.notEmpty('name'),
  isEmailValid: Ember.computed.match('email', /^.+@.+\..+$/),
  isValidPassword: Ember.computed.gte('password.length', 6),
  isValidPassword_confirmation: Ember.computed('password','password_confirmation', function() {
      return this.get('password') == this.get('password_confirmation');
  }),

  isValid: Ember.computed.and('isNameValid', 'isEmailValid', 'isValidPassword','isValidPassword_confirmation'),
  isNotValid: Ember.computed.not('isValid'),
});