import React, { Component } from 'react';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import _ from 'lodash';

import * as sectionsObject from './sectionIndex';
import BaseProfile from '../../components/Profile';
import DescriptionAndSynonyms from '../../components/DescriptionAndSynonyms';

const sections = Object.values(sectionsObject);

const summariesQuery = gql`
  query DiseaseSummaryQuery($efoId: String!) {
    disease(efoId: $efoId) {
      id
      name
      ${sections
        .filter(s => s.summaryQuery)
        .map(s => `...disease${_.upperFirst(s.id)}Fragment`)
        .join('\n')}
    }
  }
  ${sections
    .filter(s => s.summaryQuery)
    .map(s => print(s.summaryQuery))
    .join('\n')}
`;

const entitySummariesAccessor = data =>
  (data &&
    data.disease &&
    sections
      .filter(s => s.summaryQuery)
      .reduce((obj, s) => ({ ...obj, [s.id]: data.disease[s.id] }), {})) ||
  {};

const entitySectionsAccessor = data =>
  data && data.disease ? data.disease : {};

class DiseaseProfile extends Component {
  render() {
    const { efoId, name, synonyms, description } = this.props;
    const entity = { efoId, name, synonyms, description };
    return (
      <BaseProfile
        {...{
          entity,
          query: summariesQuery,
          variables: { efoId },
          sectionsOrderKey: 'diseaseSectionsOrder',
          unorderedSections: sections,
          entitySummariesAccessor,
          entitySectionsAccessor,
        }}
      >
        <DescriptionAndSynonyms description={description} synonyms={synonyms} />
      </BaseProfile>
    );
  }
}

export default DiseaseProfile;
