import Ember from 'ember';

const {
  get,
  inject
} = Ember;
/**
 * Profile service
 *
 * Service that provides profile configurations for metadata records.
 *
 * @module
 * @augments ember/Service
 */
export default Ember.Service.extend({
  flashMessages: inject.service(),
  /**
   * String identifying the active profile
   *
   * @type {?String}
   */
  active: null,

  /**
   * Get the active profile.
   *
   * @function
   * @returns {Object}
   */
  getActiveProfile() {
    const active = this.get('active');
    const profile = active && typeof active === 'string' ? active : 'full';
    const profiles = this.get('profiles');

    if(profiles[profile]) {
      return profiles[profile];
    } else {
      get(this, 'flashMessages')
        .warning(`Profile "${active}" not found. Using "full" profile.`);
      return 'full';
    }
  },

  /**
   * An object defining the available profiles
   *
   * @type {Object} profiles
   */
  profiles: {
    full: {
      profile: null,
      secondaryNav: [{
          title: 'Main',
          target: 'record.show.edit.main'

        }, {
          title: 'Metadata',
          target: 'record.show.edit.metadata'

        }, {
          title: 'Keywords',
          target: 'record.show.edit.keywords'

        }, {
          title: 'Extent',
          target: 'record.show.edit.extent'

        }, {
          title: 'Lineage',
          target: 'record.show.edit.lineage'

        }, {
          title: 'Distribution',
          target: 'record.show.edit.distribution'

        }, {
          title: 'Associated',
          target: 'record.show.edit.associated'

        }, {
          title: 'Documents',
          target: 'record.show.edit.documents'

        }, {
          title: 'Funding',
          target: 'record.show.edit.funding'

        }
        /*, {
                title: 'Coverage',
                target: 'record.show.edit.coverages'

              }, {
                title: 'Grid',
                target: 'record.show.edit.grid'
              }*/
      ],
      components: {
        record: {
          main: {
            recordId: true,
            status: true,
            defaultLocale: true,
            resourceType: true,
            pointOfContact: true,
            description: true,
            abstract: true,
            shortAbstract: true,
            supplementalInfo: true,
            purpose: true,
            environmentDescription: true,
            credit: true,
            citation: {
              title: true,
              alternateTitle: true,
              date: true,
              edition: true,
              onlineResource: true,
              responsibleParty: true,
              presentationForm: true,
              otherCitationDetails: true,
              graphic: true,
              series: {
                name: true,
                issue: true,
                page: true
              },
              identifier: {
                identifier: true,
                namespace: true,
                version: true,
                description: true,
                authority: {
                  title: true,
                  alternateTitle: true,
                  date: true,
                  responsibleParty: true
                }
              }
            }
          },
          metadata: {
            basicInformation: true,
            metadataStatus: true,
            metadataDate: true,
            metadataContact: true,
            defaultLocale: true,
            metadataIdentifier: {
              identifier: true,
              namespace: true,
              version: true,
              description: true,
              authority: {
                title: true,
                alternateTitle: true,
                date: true,
                responsibleParty: true
              }
            },
            parentMetadata: {
              title: true,
              alternateTitle: true,
              date: true,
              edition: true,
              onlineResource: true,
              responsibleParty: true,
              presentationForm: true,
              otherCitationDetails: true,
              graphic: true,
              series: {
                name: true,
                issue: true,
                page: true
              },
              identifier: {
                identifier: true,
                namespace: true,
                version: true,
                description: true,
                authority: {
                  title: true,
                  alternateTitle: true,
                  date: true,
                  responsibleParty: true
                }
              }
            },
            alternateMetadata: {
              title: true,
              alternateTitle: true,
              date: true,
              edition: false,
              responsibleParty: true,
              onlineResource: true,
              presentationForm: true,
              otherCitationDetails: true,
              graphic: true,
              series: {
                name: true,
                issue: true,
                page: true
              },
              identifier: {
                identifier: true,
                namespace: true,
                version: true,
                description: true,
                authority: {
                  title: true,
                  alternateTitle: true,
                  date: true,
                  responsibleParty: true
                }
              }
            },
            maintenance: {
              frequency: true,
              date: true,
              contact: true,
              note: true,
              scope: true,
            }
          },
          lineage: {
            statement: true,
            processStep: {
              stepId: true,
              description: true,
              processor: true,
              reference: true,
              scope: true
            },
            scope: true,
            citation: {
              title: true,
              alternateTitle: true,
              date: true,
              edition: true,
              onlineResource: true,
              responsibleParty: true,
              presentationForm: true,
              otherCitationDetails: true,
              graphic: true,
              series: {
                name: true,
                issue: true,
                page: true
              },
              identifier: {
                identifier: true,
                namespace: true,
                version: true,
                description: true,
                authority: {
                  title: true,
                  alternateTitle: true,
                  date: true,
                  responsibleParty: true
                }
              }
            }
          }
        }
      }
    },
    publication: {
      secondaryNav: [{
        title: 'Main',
        target: 'record.show.edit.main'

      }, {
        title: 'Metadata',
        target: 'record.show.edit.metadata'

      }, {
        title: 'Keywords',
        target: 'record.show.edit.keywords'

      }, {
        title: 'Extent',
        target: 'record.show.edit.extent'

      }, {
        title: 'Distribution',
        target: 'record.show.edit.distribution'

      }, {
        title: 'Associated',
        target: 'record.show.edit.associated'

      }, {
        title: 'Documents',
        target: 'record.show.edit.documents'

      }],
      components: {
        record: {
          main: {
            supplementalInfo: false,
            environmentDescription: false
          }
        }
      }
    },
    basic: {
      profile: null,
      secondaryNav: [{
        title: 'Main',
        target: 'record.show.edit.main'

      }, {
        title: 'Metadata',
        target: 'record.show.edit.metadata'

      }, {
        title: 'Keywords',
        target: 'record.show.edit.keywords'

      }, {
        title: 'Extent',
        target: 'record.show.edit.extent'

      }, {
        title: 'Distribution',
        target: 'record.show.edit.distribution'

      }],
      components: {
        record: {
          main: {
            recordId: false,
            defaultLocale: false,
            description: true,
            shortAbstract: false,
            supplementalInfo: false,
            purpose: false,
            environmentDescription: false,
            credit: false
          }
        }
      }
    },
    dictionary: {
      secondaryNav: [{
        title: 'Main',
        target: 'dictionary.show.edit.index'

      }, {
        title: 'Domains',
        target: 'dictionary.show.edit.domains'

      }, {
        title: 'Entities',
        target: 'dictionary.show.edit.entities'

      }]
    }
  }
});
