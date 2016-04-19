import Ember from 'ember';

export default Ember.Controller.extend({
  noSong: Ember.computed('model.songs.length', function () {
    return this.get('model.songs.length') === 0;
  }),
  songCreationStarted: false,
  actions: {
    updateRating(params) {
      //debugger;
      console.log("control");
      var song = params.item;
      let rating = params.rating;
      song.set('rating', rating);
      return true;
    },
    enableSongCreation: function () {
      this.set('songCreationStarted', true);
    }
  }
});
