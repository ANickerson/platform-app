import React from 'react';

import { Link } from 'ot-ui';

import Table from '../../../common/Table/Table';
import { PaginationActionsComplete } from '../../../common/Table/TablePaginationActions';

const columns = [
  {
    id: 'phenotype',
    propertyPath: 'name',
  },
  {
    id: 'identifier',
    propertyPath: 'disease',
    exportValue: d => d.url,
    renderCell: d => (
      <Link external to={d.url}>
        {d.disease}
      </Link>
    ),
  },
];

const Section = ({ data }) => (
  <Table
    columns={columns}
    dataDownloader
    dataDownloaderFileStem="phenotypes"
    pagination={PaginationActionsComplete}
    rows={data}
    showGlobalFilter
  />
);

export default Section;
