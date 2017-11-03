import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  email:  DS.attr('string'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
  games: DS.hasMany('games', {inverse: 'user'}),

  isNameValid: Ember.computed.notEmpty('name'),
  isEmailValid: Ember.computed.match('email', /^.+@.+\..+$/),
  isValidPassword: Ember.computed.gte('password.length', 6),

  isValid: Ember.computed.and('isNameValid', 'isEmailValid', 'isValidPassword'),
  isNotValid: Ember.computed.not('isValid'),
});