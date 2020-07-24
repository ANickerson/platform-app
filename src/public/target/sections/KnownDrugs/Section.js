import React, { useEffect, useReducer } from 'react';
import ReactGA from 'react-ga';
import { loader } from 'graphql.macro';
import { Link } from 'ot-ui';

import client from '../../../client';
import SourceDrawer from '../../../common/sections/KnownDrugs/custom/SourceDrawer';
import Table from '../../../common/Table/Table';
import { getPage } from '../../../common/Table/utils';
import useCursorBatchDownloader from '../../../../hooks/useCursorBatchDownloader';
import { label } from '../../../../utils/global';
const KNOWN_DRUGS_QUERY = loader('./sectionQuery.gql');

const columnPool = {
  clinicalTrialsColumns: {
    label: 'Clinical trials information',
    columns: [
      {
        id: 'phase',
      },
      {
        id: 'status',
        renderCell: d => label(d.status),
      },
      {
        id: 'sources',
        label: 'Source',
        exportValue: d => d.urls.map(reference => reference.url),
        renderCell: d => <SourceDrawer references={d.urls} />,
      },
    ],
  },
  diseaseColumns: {
    label: 'Disease information',
    columns: [
      {
        id: 'disease',
        propertyPath: 'disease.id',
        renderCell: d => (
          <Link to={`/disease/${d.disease.id}`}>{label(d.disease.name)}</Link>
        ),
      },
    ],
  },
  drugColumns: {
    label: 'Drug information',
    columns: [
      {
        id: 'drug',
        propertyPath: 'drug.id',
        renderCell: d => (
          <Link to={`/drug/${d.drug.id}`}>{label(d.drug.name)}</Link>
        ),
      },
      {
        id: 'type',
        propertyPath: 'drugType',
        renderCell: d => label(d.drugType),
      },
      {
        id: 'mechanismOfAction',
      },
      {
        id: 'activity',
        hidden: ['lgDown'],
        renderCell: d => label(d.activity),
      },
    ],
  },
  targetColumns: {
    label: 'Target information',
    columns: [
      {
        id: 'targetSymbol',
        label: 'Symbol',
        propertyPath: 'target.approvedSymbol',
        renderCell: d => (
          <Link to={`/target/${d.target.id}`}>{d.target.approvedSymbol}</Link>
        ),
      },
      {
        id: 'targetName',
        label: 'Name',
        propertyPath: 'target.approvedName',
        hidden: ['lgDown'],
        renderCell: d => label(d.target.approvedName),
      },
    ],
  },
};

const columnsToShow = [
  columnPool.drugColumns,
  columnPool.diseaseColumns,
  columnPool.clinicalTrialsColumns,
];

const stickyColumn = 'drug';

const columns = [];

columnsToShow.forEach(columnGroup => {
  columns.push(
    ...columnGroup.columns.map(column =>
      column.id === stickyColumn ? { ...column, sticky: true } : column
    )
  );
});

const headerGroups = [
  ...columnsToShow.map(group => ({
    colspan: group.columns.length,
    label: group.label,
  })),
];

const fetchDrugs = (ensemblId, cursor, size, freeTextQuery) => {
  return client.query({
    query: KNOWN_DRUGS_QUERY,
    variables: {
      ensemblId,
      cursor,
      size,
      freeTextQuery,
    },
  });
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true };
    case 'FETCH_END':
      return { ...state, loading: false, ...action };
    case 'NEW_PAGE':
      return { ...state, page: action.page };
    case 'NEW_PAGE_SIZE':
      return { ...state, pageSize: action.pageSize };
    default:
      throw new Error('some error');
  }
}

const initialState = {
  loading: true,
  count: 0,
  cursor: null,
  rows: [],
  page: 0,
  pageSize: 10,
  globalFilter: '',
};

const Section = ({ ensgId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, count, cursor, rows, page, pageSize, globalFilter } = state;

  useEffect(
    () => {
      fetchDrugs(ensgId).then(res => {
        const { cursor, count, rows } = res.data.target.knownDrugs;
        dispatch({ type: 'FETCH_END', loading: false, cursor, count, rows });
      });
    },
    [ensgId]
  );

  const getWholeDataset = useCursorBatchDownloader(
    KNOWN_DRUGS_QUERY,
    { ensemblId: ensgId },
    'data.target.knownDrugs'
  );

  const handlePageChange = newPage => {
    if (
      pageSize * newPage + pageSize > rows.length &&
      (cursor === null || cursor.length !== 0)
    ) {
      dispatch({ type: 'FETCH_START' });
      fetchDrugs(ensgId, cursor, pageSize, globalFilter).then(res => {
        const { cursor, rows: newRows } = res.data.target.knownDrugs;
        dispatch({
          type: 'FETCH_END',
          cursor,
          page: newPage,
          rows: [...rows, ...newRows],
        });
      });
    } else {
      dispatch({ type: 'NEW_PAGE', page: newPage });
    }
  };

  const handleRowsPerPageChange = pageSize => {
    if (pageSize > rows.length) {
      dispatch({ type: 'FETCH_START' });
      fetchDrugs(ensgId, cursor, pageSize, globalFilter).then(res => {
        const { cursor, rows: newRows } = res.data.target.knownDrugs;
        dispatch({
          type: 'FETCH_END',
          cursor,
          page: 0,
          pageSize,
          rows: [...rows, ...newRows],
        });
      });
    } else {
      dispatch({ type: 'NEW_PAGE_SIZE', page: 0, pageSize: pageSize });
    }
  };

  const handleGlobalFilterChange = globalFilter => {
    dispatch({ type: 'FETCH_START' });
    ReactGA.event({
      category: 'Target Profile Page',
      action: 'Typed in knownDrugs widget search',
      label: globalFilter,
    });
    fetchDrugs(ensgId, null, pageSize, globalFilter).then(res => {
      const { cursor, count, rows = [] } = res.data.target.knownDrugs ?? {};
      dispatch({
        type: 'FETCH_END',
        page: 0,
        cursor,
        count,
        globalFilter,
        rows,
      });
    });
  };

  return (
    <Table
      loading={loading}
      stickyHeader
      showGlobalFilter
      globalFilter={globalFilter}
      dataDownloader
      dataDownloaderRows={getWholeDataset}
      dataDownloaderFileStem={`${ensgId}-known-drugs`}
      headerGroups={headerGroups}
      columns={columns}
      rows={getPage(rows, page, pageSize)}
      rowCount={count}
      rowsPerPageOptions={[10, 25, 100]}
      page={page}
      pageSize={pageSize}
      onGlobalFilterChange={handleGlobalFilterChange}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default Section;
