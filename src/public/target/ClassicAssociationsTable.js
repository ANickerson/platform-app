import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
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

const dataTypes = [
  { id: 'genetic_association', label: 'Genetic associations' },
  { id: 'somatic_mutation', label: 'Somatic mutations' },
  { id: 'known_drug', label: 'Drugs' },
  { id: 'affected_pathway', label: 'Pathways & systems biology' },
  { id: 'rna_expression', label: 'RNA expression' },
  { id: 'literature', label: 'Text mining' },
  { id: 'animal_model', label: 'Animal models' },
];

const useStyles = makeStyles(theme => ({
  heatmap: {
    width: '580px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
  },
  rotate: {
    height: '140px',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid #ccc',
  },
  headerDiv: {
    transform: 'translate(15px, 110px) rotate(315deg)',
    width: '30px',
  },
  headerSpan: {
    borderBottom: '1px solid #ccc',
    padding: '5px 10px',
  },
  row: {
    display: 'flex',
  },
  cell: {
    width: '30px',
    border: '1px solid #ccc',
    backgroundColor: 'papayawhip',
  },
  nameHeader: {
    alignSelf: 'flex-end',
    paddingRight: '14px',
    textAlign: 'end',
    width: '250px',
    borderBottom: '1px solid #ccc',
  },
  name: {
    width: '250px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    paddingRight: '14px',
    textAlign: 'end',
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

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setPageSize(event.target.value);
  };

  if (error) return null;
  const rows = data?.target.associatedDiseases ?? [];

  return (
    <div className={classes.heatmap}>
      <div className={classes.header}>
        <div className={classes.nameHeader}>Name</div>
        <div className={classes.rotate}>
          <div className={classes.headerDiv}>
            <span className={classes.headerSpan}>
              Overall Association Score
            </span>
          </div>
        </div>
        {dataTypes.map(dataType => {
          return (
            <div key={dataType.id} className={classes.rotate}>
              <div className={classes.headerDiv}>
                <span className={classes.headerSpan}>{dataType.label}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {rows.map(row => {
          return (
            <div key={row.disease.id} className={classes.row}>
              <div className={classes.name}>{row.disease.name}</div>
              <div className={classes.cell} />
              {dataTypes.map(dataType => {
                const index = row.idPerDT.indexOf(dataType.id);
                return <div key={dataType.id} className={classes.cell} />;
              })}
            </div>
          );
        })}
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        rowsPerPage={pageSize}
        page={page}
        count={300}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
      />
    </div>
  );
};

export default ClassicAssociationsTable;
