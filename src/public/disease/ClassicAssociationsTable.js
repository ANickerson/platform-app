import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useTheme } from '@material-ui/core/styles';
import { client3 } from './../client';
import { lighten } from 'polished';
import Table from '../common/Table/Table';

const DISEASE_ASSOCIATIONS_QUERY = gql`
  query DiseaseAssociationsQuery($efoId: String!, $page: Pagination!) {
    disease(efoId: $efoId) {
      associatedTargets(page: $page) {
        score
        idPerDT
        scorePerDT
        target {
          id
          approvedSymbol
        }
      }
    }
  }
`;

function getColumns(dataTypes, primaryColor) {
  const columns = [
    { id: 'approvedSymbol' },
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
      approvedSymbol: d.target.approvedSymbol,
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

const dataTypeOrder = [
  'genetic_association',
  'somatic_mutation',
  'known_drug',
  'affected_pathway',
  'rna_expression',
  'literature',
  'animal_model',
];

const ClassicAssociationsTable = ({ efoId, dataTypes }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  const { loading, error, data } = useQuery(DISEASE_ASSOCIATIONS_QUERY, {
    variables: {
      efoId,
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

  const rows = data?.disease.associatedTargets ?? [];

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Overall Association Score</th>
          <th>Genetic associations</th>
          <th>Somatic mutations</th>
          <th>Drugs</th>
          <th>Pathways & systems biology</th>
          <th>RNA expression</th>
          <th>Text mining</th>
          <th>Animal models</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          return (
            <tr key={row.target.id}>
              <td>{row.target.approvedSymbol}</td>
              <td>{row.score}</td>
              {dataTypeOrder.map(dataType => {
                const index = row.idPerDT.indexOf(dataType);
                return <td key={dataType}>{row.scorePerDT[index]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ClassicAssociationsTable;
