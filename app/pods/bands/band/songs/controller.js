import Ember from 'ember';

export default Ember.Controller.extend({
  noSong: Ember.computed('model.songs.length', () => {
    return this.get('model.songs.length') === 0;
  }),
  songCreationStarted: false,
  canCreateSong: Ember.computed('model.songs.length', function(){
    return this.get('model.songs.length');
  }),
  actions: {
    enableSongCreation(){
      this.set('canCreateSong', true);
    },
    updateRating(params) {
      let song = params.item;
      let rating = params.rating;

      if(song.get('rating') === rating){
        rating = 0;
      }
      song.set('rating', rating);
      song.save();
    }
  }
});
