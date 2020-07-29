import React from 'react';
import { SvgIcon, withStyles } from '@material-ui/core';

const styles = () => ({
  root: {
    width: 'unset',
  },
});

const DrugIcon = props => {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 72" {...props}>
      <path d="M35.08 40.17h-4.25v-4.25c0-.77-.62-1.39-1.39-1.39h-5.63c-.77 0-1.39.62-1.39 1.39v4.25h-4.25c-.77 0-1.39.62-1.39 1.39v5.63c0 .77.62 1.39 1.39 1.39h4.25v4.25c0 .77.62 1.39 1.39 1.39h5.63c.77 0 1.39-.62 1.39-1.39v-4.25h4.25c.77 0 1.39-.62 1.39-1.39v-5.63c0-.77-.62-1.39-1.39-1.39zm-1.39 5.63h-4.25c-.77 0-1.39.62-1.39 1.39v4.25H25.2v-4.25c0-.77-.62-1.39-1.39-1.39h-4.25v-2.85h4.25c.77 0 1.39-.62 1.39-1.39v-4.25h2.85v4.25c0 .77.62 1.39 1.39 1.39h4.25v2.85zm8.16-26.75a3.15 3.15 0 0 1-3.15-3.15v-.86h4.12c.77 0 1.39-.62 1.39-1.39V2.38c0-.77-.62-1.39-1.39-1.39H10.45c-.77 0-1.39.62-1.39 1.39v11.26c0 .77.62 1.39 1.39 1.39h4.12v.86a3.15 3.15 0 0 1-3.15 3.15C5.65 19.04.95 23.74.95 29.51v33.28c0 4.52 3.68 8.2 8.2 8.2h34.97c4.52 0 8.2-3.68 8.2-8.2V29.52c0-5.78-4.7-10.47-10.47-10.47zm-30.01-6.79V3.77h29.59v8.48l-29.59.01zm37.7 50.53a5.42 5.42 0 0 1-5.42 5.42H9.14a5.42 5.42 0 0 1-5.42-5.42V39.14h6.63v18.78c0 .77.62 1.39 1.39 1.39h29.77c.77 0 1.39-.62 1.39-1.39V39.14h6.63l.01 23.65zm-36.4-6.26V32.22h26.99v24.31H13.14zm36.4-20.17h-6.63v-5.53c0-.77-.62-1.39-1.39-1.39H11.75c-.77 0-1.39.62-1.39 1.39v5.53H3.72v-6.84a7.7 7.7 0 0 1 7.69-7.69 5.94 5.94 0 0 0 5.93-5.93v-.86h18.57v.86a5.94 5.94 0 0 0 5.93 5.93 7.7 7.7 0 0 1 7.69 7.69l.01 6.84z" />
    </SvgIcon>
  );
};

export default withStyles(styles)(DrugIcon);
