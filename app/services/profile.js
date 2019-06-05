import Service from '@ember/service';
import {
  inject as service
} from '@ember/service';
import request from 'ember-ajax/request';
import { task, all, timeout } from 'ember-concurrency';
import { computed } from '@ember/object';
import { union } from '@ember/object/computed';
import {
  // isAjaxError,
  isNotFoundError,
  // isForbiddenError
} from 'ember-ajax/errors';
import semver from 'semver';

const coreProfiles = [{
  "identifier": "full",
  "namespace": "org.adiwg.profile",
  //"alternateId": [""],
  "title": "Full",
  "description": "Every supported component",
  "version": "0.0.0",
  "components": {
    "record": {
      //"main": { "recordId": true }
    },
    "contact": {},
    "dictionary": {}
  },
  "nav": {
    "record": [{
      title: 'Main',
      target: 'record.show.edit.main',
      tip: 'Basic information about the resource.'

    }, {
      title: 'Metadata',
      target: 'record.show.edit.metadata',
      tip: 'Information about the metadata for the resource.'

    }, {
      title: 'Keywords',
      target: 'record.show.edit.keywords',
      tip: 'Terms used to describe the resource.'

    }, {
      title: 'Extent',
      target: 'record.show.edit.extent',
      tip: 'Information describing the bounds of the resource.'

    }, {
      title: 'Spatial',
      target: 'record.show.edit.spatial',
      tip: 'Information concerning the spatial attributes of the resource.'

    }, {
      title: 'Lineage',
      target: 'record.show.edit.lineage',
      tip: 'Information on the history of the resource.'
    }, {
      title: 'Taxonomy',
      target: 'record.show.edit.taxonomy',
      tip: 'Information on the taxa associated with the resource.'

    }, {
      title: 'Distribution',
      target: 'record.show.edit.distribution',
      tip: 'Information about obtaining the resource.'

    }, {
      title: 'Constraints',
      target: 'record.show.edit.constraint',
      tip: 'Information about constraints applied to the resource.'

    }, {
      title: 'Associated',
      target: 'record.show.edit.associated',
      tip: 'Other resources with a defined relationship to the resource.'

    }, {
      title: 'Documents',
      target: 'record.show.edit.documents',
      tip: 'Other documents related to, but not defining, the resource.'

    }, {
      title: 'Funding',
      target: 'record.show.edit.funding',
      tip: 'Information about funding allocated to development of the resource.'

    }, {
      title: 'Dictionaries',
      target: 'record.show.edit.dictionary',
      tip: 'Data dictionaries associated with the resource.'

    }],
    "dictionary": [{
      title: 'Main',
      target: 'dictionary.show.edit.index',
      tip: 'Basic information about the dictionary.'
    }, {
      title: 'Citation',
      target: 'dictionary.show.edit.citation',
      tip: 'The citation for the dictionary.'
    }, {
      title: 'Domains',
      target: 'dictionary.show.edit.domain',
      tip: 'Information about defined value lists.'

    }, {
      title: 'Entities',
      target: 'dictionary.show.edit.entity',
      tip: 'Information about entities(tables) and attributes(columns or fields).'
    }]
  }
}];
// .map(function(itm){
//   return {
//     id: itm.namespace + '.' + itm.identifier,
//     title: itm.title,
//     definition: itm.definition,
//     profile: itm
//   }
// });

/**
 * Profile service
 *
 * Service that provides profile configurations for metadata records.
 *
 * @module
 * @augments ember/Service
 */
export default Service.extend({
  // profiles: computed('profileRecords.[]', function () {
  //   return this.profileRecords;
  // }),
  profiles: union('profileRecords', 'coreProfiles'),
  mapById: computed('profiles.[]', function () {
    return this.profiles.reduce(function (map, profile) {
      map[profile.identifier] = profile;

      return map;
    }, {});
  }),
  init() {
    this._super(...arguments);

    this.profileRecords = this.store.peekAll('profile');
    //this.customProfiles = this.get('store').peekAll('custom-profile');
    this.coreProfiles = coreProfiles;

    this.oldprofiles = {
      full: {
        profile: null,
        description: 'The kitchen sink',
        secondaryNav: [
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
            },
            documents: {
              resourceType: true,
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
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              }
            }
          }
        }
      },
      lccProject: {
        profile: null,
        description: 'Profile for LCC Projects',
        secondaryNav: [{
          title: 'Main',
          target: 'record.show.edit.main',
          tip: 'Basic information about the project.'

        }, {
          title: 'Metadata',
          target: 'record.show.edit.metadata',
          tip: 'Information about the metadata for the project.'

        }, {
          title: 'Keywords',
          target: 'record.show.edit.keywords',
          tip: 'Terms used to describe the project.'

        }, {
          title: 'Extent',
          target: 'record.show.edit.extent',
          tip: 'Information describing the bounds of the project.'

        }, {
          title: 'Taxonomy',
          target: 'record.show.edit.taxonomy',
          tip: 'Information on the taxa associated with the resource.'

        }, {
          title: 'Associated',
          target: 'record.show.edit.associated',
          tip: 'Other records with a defined relationship to the project.'

        }, {
          title: 'Documents',
          target: 'record.show.edit.documents',
          tip: 'Other documents related to, but not defining, the project.'

        }, {
          title: 'Funding',
          target: 'record.show.edit.funding',
          tip: 'Information about funding allocated to development of the project.'

        }],
        components: {
          record: {
            main: {
              recordId: true,
              purpose: false,
              environmentDescription: false,
              credit: false,
              timePeriod: {
                id: false,
                description: false,
                periodName: false,
                duration: false,
                interval: false
              },
              citation: {
                edition: false,
                onlineResource: {
                  protocol: false
                },
                presentationForm: false,
                otherCitationDetails: false,
                graphic: false,
                series: false,
                identifier: {
                  identifier: true,
                  namespace: true,
                  version: false,
                  description: false,
                  authority: {
                    date: false,
                    alternateTitle: false,
                    identifier: false,
                    onlineResource: false
                  }
                },
                graphicOverview: false
              },
              graphicOverview: false
            },
            metadata: {
              identifier: {
                identifier: true,
                namespace: true,
                version: false,
                description: false,
                authority: false
              },
              parentMetadata: {
                title: true,
                alternateTitle: false,
                date: false,
                edition: false,
                onlineResource: true,
                responsibleParty: true,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifier: false,
                identifierSimple: {
                  identifier: true,
                  namespace: true,
                  version: false,
                  description: false,
                  authority: false
                }
              },
              alternateMetadataReference: false,
              defaultLocale: false,
              maintenance: false
            },
            associated: {
              resourceType: true,
              resourceCitation: {
                alternateTitle: false,
                edition: false,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              },
              metadataCitation: {
                alternateTitle: false,
                edition: false,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              }
            },
            documents: {
              resourceType: true,
              citation: {
                title: true,
                alternateTitle: true,
                date: true,
                edition: true,
                onlineResource: true,
                responsibleParty: true,
                presentationForm: true,
                otherCitationDetails: false,
                graphicOverview: false,
                series: {
                  name: true,
                  issue: true,
                  page: true
                },
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              }
            },
            funding: {
              timePeriod: {
                id: false,
                description: false,
                periodName: false,
                duration: false,
                interval: false
              }
            }
          }
        }
      },
      lccProduct: {
        profile: null,
        description: 'Profile for LCC Products',
        secondaryNav: [{
          title: 'Main',
          target: 'record.show.edit.main',
          tip: 'Basic information about the product.'

        }, {
          title: 'Metadata',
          target: 'record.show.edit.metadata',
          tip: 'Information about the metadata for the product.'

        }, {
          title: 'Keywords',
          target: 'record.show.edit.keywords',
          tip: 'Terms used to describe the product.'

        }, {
          title: 'Extent',
          target: 'record.show.edit.extent',
          tip: 'Information describing the bounds of the product.'

        }, {
          title: 'Spatial',
          target: 'record.show.edit.spatial',
          tip: 'Information concerning the spatial attributes of the product.'

        }, {
          title: 'Lineage',
          target: 'record.show.edit.lineage',
          tip: 'Information on the history of the product.'

        }, {
          title: 'Taxonomy',
          target: 'record.show.edit.taxonomy',
          tip: 'Information on the taxa associated with the resource.'

        }, {
          title: 'Distribution',
          target: 'record.show.edit.distribution',
          tip: 'Information about obtaining the product.'

        }, {
          title: 'Constraints',
          target: 'record.show.edit.constraint',
          tip: 'Information about constraints applied to the product.'

        }, {
          title: 'Associated',
          target: 'record.show.edit.associated',
          tip: 'Other records with a defined relationship to the product.'

        }, {
          title: 'Documents',
          target: 'record.show.edit.documents',
          tip: 'Other documents related to, but not defining, the product.'

        }, {
          title: 'Dictionaries',
          target: 'record.show.edit.dictionary',
          tip: 'Data dictionaries associated with the resource.'

        }],
        components: {
          record: {
            main: {
              recordId: true,
              purpose: false,
              environmentDescription: false,
              credit: false,
              timePeriod: {
                id: false,
                description: false,
                periodName: false,
                duration: false,
                interval: false
              },
              citation: {
                edition: false,
                onlineResource: {
                  protocol: false
                },
                presentationForm: false,
                otherCitationDetails: false,
                graphic: false,
                series: false,
                identifier: {
                  identifier: true,
                  namespace: true,
                  version: false,
                  description: false,
                  authority: {
                    date: false,
                    alternateTitle: false,
                    identifier: false,
                    onlineResource: false
                  }
                },
                graphicOverview: false
              },
              graphicOverview: false
            },
            metadata: {
              identifier: {
                identifier: true,
                namespace: true,
                version: false,
                description: false,
                authority: false
              },
              parentMetadata: {
                title: true,
                alternateTitle: false,
                date: false,
                edition: false,
                onlineResource: true,
                responsibleParty: true,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifier: false,
                identifierSimple: {
                  identifier: true,
                  namespace: true,
                  version: false,
                  description: false,
                  authority: false
                }
              },
              alternateMetadataReference: false,
              defaultLocale: false,
              maintenance: false
            },
            distribution: {
              distributor: {
                transferOption: {
                  distributionUnit: false,
                  transferFrequency: false,
                  distributionFormat: false,
                  offlineOption: {
                    identifier: false
                  }
                },
                orderProcess: false
              }
            },
            constraints: {
              responsibleParty: false,
              graphic: false
            },
            associated: {
              resourceType: true,
              resourceCitation: {
                alternateTitle: false,
                edition: false,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              },
              metadataCitation: {
                alternateTitle: false,
                edition: false,
                presentationForm: false,
                otherCitationDetails: false,
                graphicOverview: false,
                series: false,
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              }
            },
            documents: {
              resourceType: true,
              citation: {
                title: true,
                alternateTitle: true,
                date: true,
                edition: true,
                onlineResource: true,
                responsibleParty: true,
                presentationForm: true,
                otherCitationDetails: false,
                graphicOverview: false,
                series: {
                  name: true,
                  issue: true,
                  page: true
                },
                identifierSimple: false,
                identifierShort: {
                  identifier: true,
                  namespace: true,
                  version: true,
                  description: true
                }
              }
            },
            funding: {
              timePeriod: {
                id: false,
                description: false,
                periodName: false,
                duration: false,
                interval: false
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
              purpose: false,
              environmentDescription: false,
              supplementalInfo: false,
              credit: false,
              timePeriod: {
                id: false,
                description: false,
                periodName: false,
                duration: false,
                interval: false
              },
              citation: {
                edition: false,
                onlineResource: {
                  protocol: false
                },
                presentationForm: false,
                otherCitationDetails: false,
                graphic: false,
                series: false,
                identifier: false,
                graphicOverview: false
              },
              graphicOverview: false
            },
            metadata: {
              identifier: {
                identifier: true,
                namespace: true,
                version: false,
                description: false,
                authority: false
              },
              parentMetadata: false,
              alternateMetadataReference: false,
              defaultLocale: false,
              maintenance: false
            }
          }
        }
      },
      // dictionary: {
      //   secondaryNav: []
      // },
      // settings: {
      //   secondaryNav: [{
      //     title: 'Main',
      //     target: 'settings.main',
      //     tip: 'Main application settings'
      //   }, {
      //     title: 'Profiles',
      //     target: 'settings.profile',
      //     tip: 'Custom profile settings'
      //   }, {
      //     title: 'Validation',
      //     target: 'settings.validation',
      //     tip: 'Custom validation settings'
      //   }]
      // }
    };
  },
  flashMessages: service(),
  store: service(),
  /**
   * String identifying the active profile
   *
   * @type {?String}
   */
  // active: null,

  // activeComponents: computed('active', function () {
  //   return this.getActiveProfile().components;
  // }),
  // /**
  //  * Get the active profile.
  //  *
  //  * @function
  //  * @returns {Object}
  //  */
  // getActiveProfile() {
  //   const active = this.active;
  //   const profile = active && typeof active === 'string' ? active : 'full';
  //   const selected = this.mapById[profile];
  //
  //   if(selected) {
  //     return selected;
  //   }
  //
  //   this.flashMessages
  //     .warning(`Profile "${active}" not found. Using "full" profile.`);
  //
  //   return this.mapById.full;
  // },

  // /**
  //  * An object defining the available profiles
  //  *
  //  * @type {Object} profiles
  //  */

  fetchDefinition: task(function* (uri) {
    try {
      yield timeout(1000);

      let response = yield request(uri);

      if(response && !semver.valid(response.version)) {
        throw new Error("Invalid version");
      }

      return response;
    } catch (error) {
      if(isNotFoundError(error)) {
        this.flashMessages
          .danger(
            `Could not load profile definition from ${uri}. Definition not found.`
          );
      } else {
        this.flashMessages
          .danger(
            `Could not load profile definition from "${uri}". Error: ${error.message}`
          );
      }
    }
  }).drop(),

  checkForUpdates: task(function* (records) {
    yield timeout(1000);

    yield all(records.map(itm => {
      if(itm.validations.attrs.uri.isInvalid) {
        this.flashMessages
          .warning(
            `Did not load definition for "${itm.title}". URL is Invalid.`
          );
        return;
      }

      return request(itm.uri).then(response => {
        // `response` is the data from the server
        if(semver.valid(response.version)) {
          itm.set('remoteVersion', response.version);
        } else {
          throw new Error("Invalid version");
        }

        return response;
      }).catch(error => {
        if(isNotFoundError(error)) {
          this.flashMessages
            .danger(
              `Could not load definition for "${itm.title}". Definition not found.`
            );
        } else {
          this.flashMessages
            .danger(
              `Could not load definition for "${itm.title}". Error: ${error.message}`
            );
        }
      });
    }));
  }).drop(),
});
