import Ember from 'ember';
const {Route} = Ember;

export default Route.extend({
  model(){
    return this.modelFor('bands.band');
  },
  actions: {
    createSong(){
      let controller = this.get('controller');
      let band = this.modelFor('bands.band');
      let song = this.store.createRecord('song', {
        title: controller.get('title'),
        band: band
      });
      song.save().then(() => {
        controller.set('title', '');
      });
    },
    resetController(controller){
      controller.set('songCreationStarted', false);
    },
    didTransaction(){
      document.title = "${band.get('name')} songs - Rock & Roll";
    }
  }
});
