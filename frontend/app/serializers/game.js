import DS from 'ember-data';

export default DS.JSONSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    user: { embedded:'always' },
    opponent: { embedded:'always' },
    winner: { embedded: 'always' },
  }

});
