import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';

@classic
export default class AlternateRoute extends Route {
  model(params) {
    this.set('citationId', params.citation_id);

    return this.setupModel();
  }

  setupController() {
    // Call _super for default behavior
    super.setupController(...arguments);

    this.controller.set('parentModel', this.modelFor('record.show.edit'));
    this.controllerFor('record.show.edit').setProperties({
      onCancel: this.setupModel,
      cancelScope: this,
    });
  }

  setupModel() {
    let citationId = this.citationId;
    let model = this.modelFor('record.show.edit');
    let citations = model.get(
      'json.metadata.metadataInfo.alternateMetadataReference'
    );
    let citation =
      citationId && isArray(citations) ? citations.get(citationId) : undefined;

    //make sure the identifier exists
    if (isEmpty(citation)) {
      this.flashMessages.warning('No citation found! Re-directing...');
      this.replaceWith('record.show.edit.metadata');

      return;
    }

    return citation;
  }

  @action
  parentModel() {
    return this.modelFor('record.show.edit');
  }
}