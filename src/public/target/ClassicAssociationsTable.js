import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import { client3 } from './../client';
import { lighten } from 'polished';
import Table from '../common/Table/Table';

const TARGET_ASSOCIATIONS_QUERY = gql`
  query TargetAssociationsQuery($ensemblId: String!, $page: Pagination!) {
    target(ensemblId: $ensemblId) {
      associatedDiseases(page: $page) {
        score
        idPerDT
        scorePerDT
        disease {
          id
          name
        }
      }
    }
  }
`;

function getColumns(dataTypes, primaryColor) {
  console.log('primaryColor', primaryColor);
  console.log('lighten 0', lighten(0, primaryColor));
  console.log('lighten 1', lighten(1, primaryColor));
  console.log('lighten', lighten(0.2, primaryColor));

  const columns = [
    { id: 'name' },
    {
      id: 'overall',
      renderCell: row => {
        return (
          <div
            style={{ backgroundColor: lighten(1 - row.overall, primaryColor) }}
          >
            {row.overall}
          </div>
        );
      },
    },
  ];
  dataTypes.forEach(dataType => {
    columns.push({
      id: dataType,
      renderCell: row => {
        return (
          <div
            style={{
              backgroundColor: lighten(1 - row[dataType], primaryColor),
            }}
          >
            {row[dataType]}
          </div>
        );
      },
    });
  });

  return columns;
}

function getRows(data, dataTypes) {
  return data.map(d => {
    const row = {
      name: d.disease.name,
      overall: d.score,
    };

    dataTypes.forEach(dataType => {
      const index = d.idPerDT.indexOf(dataType);

      if (index === -1) {
        row[dataType] = 0;
      } else {
        row[dataType] = d.scorePerDT[index];
      }
    });
    return row;
  });
}

const ClassicAssociationsTable = ({ ensgId, dataTypes }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const { loading, error, data } = useQuery(TARGET_ASSOCIATIONS_QUERY, {
    variables: {
      ensemblId: ensgId,
      page: { index: page, size: pageSize },
    },
    client: client3,
  });

  const handlePageChange = page => {
    setPage(page);
  };

  const handleRowsPerPageChange = pageSize => {
    setPageSize(pageSize);
  };

  if (error) return null;

  const columns = getColumns(dataTypes, theme.palette.primary.main);
  const rows = getRows(data?.target.associatedDiseases ?? [], dataTypes);

  return (
    <Table
      loading={loading}
      columns={columns}
      rows={rows}
      rowCount={300}
      page={page}
      pageSize={pageSize}
      rowsPerPageOptions={[10, 25, 100]}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default ClassicAssociationsTable;
