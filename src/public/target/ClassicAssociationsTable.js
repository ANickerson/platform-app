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
  const columns = [
    { id: 'name', slanted: true },
    {
      id: 'overall',
      slanted: true,
      renderCell: row => {
        return (
          <div
            style={{
              backgroundColor: lighten(1 - row.overall, primaryColor),
              width: '15px',
              height: '15px',
            }}
          />
        );
      },
    },
  ];
  dataTypes.forEach(dataType => {
    columns.push({
      id: dataType,
      slanted: true,
      renderCell: row => {
        return (
          <div
            style={{
              backgroundColor: lighten(1 - row[dataType], primaryColor),
              width: '15px',
              height: '15px',
            }}
          />
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

const dataTypeOrder = [
  'genetic_association',
  'somatic_mutation',
  'known_drug',
  'affected_pathway',
  'rna_expression',
  'literature',
  'animal_model',
];

const ClassicAssociationsTable = ({ ensgId, dataTypes }) => {
  console.log('dataTypes', dataTypes);
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

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
  // const rows = getRows(data?.target.associatedDiseases ?? [], dataTypes);
  const rows = data?.target.associatedDiseases ?? [];

  console.log('rows', rows);

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
            <tr key={row.disease.id}>
              <td>{row.disease.name}</td>
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
