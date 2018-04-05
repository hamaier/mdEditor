import Ember from 'ember';
import HashPoll from 'mdeditor/mixins/hash-poll';
import {
  once
} from '@ember/runloop';
import {
  getOwner
} from '@ember/application';

const {
  inject,
  get,
  Route
} = Ember;

export default Route.extend(HashPoll, {
  /**
   * The profile service
   *
   * @return {Ember.Service} profile
   */
  profile: inject.service(),

  /**
   * The route activate hook, sets the profile to 'dictionary'.
   */
  activate() {
    this.get('profile')
      .set('active', 'dictionary');
  },

  renderTemplate() {
    this.render('nav-secondary', {
      into: 'application',
      outlet: 'nav-secondary'
    });
    this.render('dictionary.show.edit', {
      into: 'dictionary.show'
    });
  },
  actions: {
    saveDictionary: function () {
      let model = this.currentRouteModel();

      model
        .save()
        .then(() => {
          //this.refresh();
          //this.setModelHash();
          get(this, 'flashMessages')
            .success(`Saved Dictionary: ${model.get('title')}`);

          //this.transitionTo('contacts');
        });
    },
    cancelDictionary: function () {
      let model = this.currentRouteModel();
      let message =
        `Cancelled changes to Dictionary: ${model.get('title')}`;
      let controller = this.controller;
      let same = !controller.cancelScope || getOwner(this)
        .lookup('controller:application')
        .currentPath === get(controller,'cancelScope.routeName');

      if(this.get('settings.data.autoSave')) {
        let json = model.get('jsonRevert');

        if(json) {
          model.set('json', JSON.parse(json));

          if(controller.onCancel) {
            once(() => {
              if(same) {
                controller.onCancel.call(controller.cancelScope ||
                  this);
              }
              this.refresh();
              controller.set('onCancel', null);
              controller.set('cancelScope', null);
            });
          }

          get(this, 'flashMessages')
            .warning(message);
        }

        return;
      }

      model
        .reload()
        .then(() => {
          if(controller.onCancel) {
            once(() => {
              if(same) {
                controller.onCancel.call(controller.cancelScope ||
                  this);
              }
              this.refresh();
              controller.set('onCancel', null);
              controller.set('cancelScope', null);
            });
          }
          get(this, 'flashMessages')
            .warning(message);
        });
    },
  }
});