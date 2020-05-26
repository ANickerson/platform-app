export const targetSectionsDefaultOrder = [
  'knownDrugs',
  'tractability',
  // 'safety',
  'chemicalProbes',
  // 'bibliography',
  // 'variation',
  // 'expression',
  // 'protein',
  // 'homology',
  'geneOntology',
  // 'proteinInteractions',
  // 'pathways',
  'relatedTargets',
  // 'mousePhenotypes',
  'hallmarks',
  'cancerBiomarkers',
];

export const diseaseSectionsDefaultOrder = [
  'knownDrugs',
  'ontology',
  'bibliography',
  'phenotypes',
  'relatedDiseases',
];

export const drugSectionsDefaultOrder = [
  'knownDrugs',
  'mechanismsOfAction',
  'adverseEvents',
  'bibliography',
  'indications',
];

export const evidenceSectionsDefaultOrder = [
  'gwasCatalog',
  'phewasCatalog',
  'eva',
  'uniProt',
  'uniProtLiterature',
  'gene2Phenotype',
  'genomicsEngland',
  'intogen',
  'cancerGeneCensus',
  'evaSomatic',
  'uniProtSomatic',
  'reactome',
  'progeny',
  'slapenrich',
  'crispr',
  'sysBio',
  'drugs',
  'differentialExpression',
  'textMining',
  'animalModels',
];

export const evidenceByDatatypeSectionsDefaultOrder = [
  'genetic',
  'somatic',
  'drugs',
  'pathways',
  'differentialExpression',
  'textMining',
  'animalModels',
];

// Known drugs widget links on the 'source' column.
export const clinicalTrialsSearchUrl = 'https://clinicaltrials.gov/ct2/results';

// useBatchDownloader hook.
export const chunkSize = 1000;
