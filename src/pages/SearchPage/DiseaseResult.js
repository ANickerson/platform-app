import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Clampy from '@clampy-js/react-clampy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'ot-ui';

import Highlights from '../../components/Highlights';

const styles = theme => ({
  container: {
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 500,
  },
  icon: {
    color: theme.palette.primary.main,
  },
});

const DiseaseResult = ({ classes, data, highlights }) => {
  return (
    <div className={classes.container}>
      <Link to={`/disease/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon
          icon={faStethoscope}
          size="md"
          className={classes.icon}
        />{' '}
        {data.name}
      </Link>
      {data.description && (
        <Typography variant="body2" component="div">
          <Clampy clampSize="4">{data.description}</Clampy>
        </Typography>
      )}
      <Highlights highlights={highlights} />
    </div>
  );
};

export default withStyles(styles)(DiseaseResult);
