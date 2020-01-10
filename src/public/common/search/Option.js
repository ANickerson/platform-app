import React from 'react';
import Typography from '@material-ui/core/Typography';

const TargetOption = ({ data }) => {
  return (
    <>
      <Typography variant="subtitle2" style={{ display: 'inline-block' }}>
        {data.approvedSymbol}
      </Typography>
      <Typography
        variant="caption"
        color="textSecondary"
        style={{ display: 'inline-block', marginLeft: '8px' }}
      >
        {data.approvedName}
      </Typography>
    </>
  );
};

const DiseaseOption = ({ data }) => {
  return <Typography variant="subtitle2">{data.name}</Typography>;
};

const DrugOption = ({ data }) => {
  return <Typography variant="subtitle2">{data.name}</Typography>;
};

const TargetTopHit = ({ data }) => {
  return (
    <>
      <Typography variant="h6" color="primary">
        {data.approvedSymbol}
      </Typography>{' '}
      <Typography>{data.approvedName}</Typography>
      <Typography variant="caption" noWrap>
        {data.proteinAnnotations.functions[0]}
      </Typography>
    </>
  );
};

const DiseaseTopHit = ({ data }) => {
  return (
    <>
      <Typography variant="h6" color="primary">
        {data.name}
      </Typography>
      <Typography variant="caption" noWrap>
        {data.description}
      </Typography>
    </>
  );
};

const DrugTopHit = ({ data }) => {
  const { rows = [] } = data.mechanismsOfAction;

  return (
    <>
      <Typography variant="h6" color="primary">
        {data.name}
      </Typography>
      <Typography variant="caption" noWrap>
        {rows.map(row => row.mechanismOfAction).join(', ')}
      </Typography>
    </>
  );
};

const TopHit = ({ data }) => {
  return data.__typename === 'Target' ? (
    <TargetTopHit data={data} />
  ) : data.__typename === 'Disease' ? (
    <DiseaseTopHit data={data} />
  ) : (
    <DrugTopHit data={data} />
  );
};

const Option = props => {
  const { innerRef, innerProps, isFocused, data, theme } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        backgroundColor: isFocused ? theme.colors.neutral10 : null,
        padding: '0 8px 0 8px',
        cursor: 'pointer',
      }}
    >
      {data.entityType === 'search' ? (
        <Typography>{data.label}</Typography>
      ) : data.entityType === 'topHit' ? (
        <TopHit data={data} />
      ) : data.entityType === 'target' ? (
        <TargetOption data={data} />
      ) : data.entityType === 'disease' ? (
        <DiseaseOption data={data} />
      ) : (
        <DrugOption data={data} />
      )}
    </div>
  );
};

export default Option;
