import { loader } from 'graphql.macro';

export const id = 'hallmarks';
export const name = 'Cancer Hallmarks';

export const hasSummaryData = data => data && data.rows.length > 0;

export const summaryQuery = loader('./summaryQuery.gql');
export const sectionQuery = loader('./sectionQuery.gql');

export { default as DescriptionComponent } from './Description';
export { default as SummaryComponent } from './Summary';
export { default as SectionComponent } from './Section';
