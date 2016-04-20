import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.modelFor('bands.band');
  },
  actions: {
    willTransition(transition){
      let controller = this.get('controller');
      let leave;
      if(controller.get('isEditing')){
        leave = window.confirm("asd??");
        if(leave){
          controller.set('isEditing', false);
        } else {
          transition.abort();
        }
      }
    },
    save(){
      let controller = this.get('controller');
      let band = controller.get('model');
      return band.save();
    }
  }
});
