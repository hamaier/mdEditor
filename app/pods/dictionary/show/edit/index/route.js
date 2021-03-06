import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { set, getWithDefault, get, action } from '@ember/object';
import ScrollTo from 'mdeditor/mixins/scroll-to';

@classic
export default class IndexRoute extends Route.extend(ScrollTo) {
  afterModel(m) {
    super.afterModel(...arguments);

    let model = get(m, 'json.dataDictionary');
    set(model, 'citation', getWithDefault(model, 'citation', {}));
    set(
      model,
      'responsibleParty',
      getWithDefault(model, 'responsibleParty', {})
    );
    set(model, 'subject', getWithDefault(model, 'subject', []));
    set(model, 'recommendedUse', getWithDefault(model, 'recommendedUse', []));
    set(model, 'locale', getWithDefault(model, 'locale', []));
    set(model, 'domain', getWithDefault(model, 'domain', []));
    set(model, 'entity', getWithDefault(model, 'entity', []));
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    this.controllerFor('dictionary.show.edit').setProperties({
      onCancel: () => this,
      cancelScope: this,
    });
  }

  @action
  editCitation(scrollTo) {
    this.transitionTo('dictionary.show.edit.citation').then(
      function () {
        this.setScrollTo(scrollTo);
      }.bind(this)
    );
  }
}