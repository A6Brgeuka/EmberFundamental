import Ember from 'ember';
import Song from '../../../../models/song';
//import StarRatingComponent from './../../../../components/star-rating';

export default Ember.Route.extend({
  model(){
    return this.modelFor('bands.band');
  },
  actions: {
    createSong(){
      debugger;
      let controller = this.get('controller');
      let band = this.modelFor('bands.band');
      let title = controller.get('title');
      let song = Song.create({ title: title, band: band });
      band.get('songs').pushObject(song);
      controller.set('title', '');
    },
    updateRating(params) {
      //debugger;
      console.log("route");
      var song = params.item;
      let rating = params.rating;
      song.set('rating', rating);
    }
  }
});
