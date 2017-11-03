import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTSerializer.extend({

 normalizeSingleResponse(store, primaryModelClass, payload, id, requestType) {
   let typeKey = primaryModelClass.modelName;
   let ret = {};
   ret[typeKey] = payload;
   return this._normalizeResponse(store, primaryModelClass, ret, id, requestType, true);
 },
 normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
   let pluralTypeKey = Ember.Inflector.inflector.pluralize(primaryModelClass.modelName);
   let ret = {};
   ret[pluralTypeKey] = payload;
   return this._normalizeResponse(store, primaryModelClass, ret, id, requestType, false);
 }

});