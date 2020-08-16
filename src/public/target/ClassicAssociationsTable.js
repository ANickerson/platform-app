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
  header: {
    display: 'flex',
    position: 'sticky',
    top: 0,
  },
  rotate: {
    // position: 'sticky',
    // top: 0,
    height: '140px',
    whiteSpace: 'nowrap',
  },
  headerDiv: {
    transform: 'translate(15px, 110px) rotate(315deg)',
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
    width: '250px',
  },
  row: {
    display: 'flex',
  },
  name: {
    width: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const ClassicAssociationsTable = ({ ensgId }) => {
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
    <div>
      <div className={classes.header}>
        <div className={classes.nameHeader}>
          <div>
            <span>Name</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>
              Overall Association Score
            </span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>Genetic associations</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>Somatic mutations</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>Drugs</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>
              Pathways & systems biology
            </span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>RNA expression</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>Text mining</span>
          </div>
        </div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>Animal models</span>
          </div>
        </div>
      </div>
      <div>
        {rows.map(row => {
          return (
            <div key={row.disease.id} className={classes.row}>
              <div className={classes.name}>{row.disease.name}</div>
              <div className={classes.dataCell} />
              {dataTypeOrder.map(dataType => {
                const index = row.idPerDT.indexOf(dataType);
                return <div key={dataType} className={classes.dataCell} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassicAssociationsTable;
