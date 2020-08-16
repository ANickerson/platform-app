import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { client3 } from './../client';
import { lighten } from 'polished';

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

const dataTypeOrder = [
  'genetic_association',
  'somatic_mutation',
  'known_drug',
  'affected_pathway',
  'rna_expression',
  'literature',
  'animal_model',
];

const useStyles = makeStyles(theme => ({
  heatmap: {
    borderCollapse: 'collapse',
  },
  rotate: {
    position: 'sticky',
    top: 0,
    height: '140px',
    whiteSpace: 'nowrap',
  },
  headerDiv: {
    transform: 'translate(17px, 50px) rotate(315deg)',
    width: '30px',
  },
  headerSpan: {
    borderBottom: '1px solid #ccc',
    padding: '5px 10px',
  },
  dataCell: {
    width: '30px',
    border: '1px solid #ccc',
    backgroundColor: 'papayawhip',
  },
  nameHeader: {
    verticalAlign: 'bottom',
  },
  name: {
    maxWidth: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const ClassicAssociationsTable = ({ ensgId, dataTypes }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const classes = useStyles();

  const { loading, error, data } = useQuery(TARGET_ASSOCIATIONS_QUERY, {
    variables: {
      ensemblId: ensgId,
      page: { index: page, size: pageSize },
    },
    client: client3,
  });

  if (error) return null;
  const rows = data?.target.associatedDiseases ?? [];

  return (
    <table className={classes.heatmap}>
      <thead>
        <tr>
          <th className={classes.nameHeader}>
            <div>
              <span>Name</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>
                Overall Association Score
              </span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>Genetic associations</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>Somatic mutations</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>Drugs</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>
                Pathways & systems biology
              </span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>RNA expression</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>Text mining</span>
            </div>
          </th>
          <th className={classes.rotate}>
            <div className={classes.headerDiv}>
              <span className={classes.headerSpan}>Animal models</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => {
          return (
            <tr key={row.disease.id}>
              <td>
                <div className={classes.name}>{row.disease.name}</div>
              </td>
              <td className={classes.dataCell} />
              {dataTypeOrder.map(dataType => {
                const index = row.idPerDT.indexOf(dataType);
                return <td key={dataType} className={classes.dataCell} />;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ClassicAssociationsTable;
