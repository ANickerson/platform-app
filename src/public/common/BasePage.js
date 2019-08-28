import React from 'react';
import { Helmet } from 'react-helmet';
import { Page, NavBar, Footer } from 'ot-ui';

import { externalLinks } from '../../constants';

const BasePage = ({ children }) => (
  <Page
    header={NavBar}
    footer={Footer}
    headerProps={{ name: 'Platform' }}
    footerProps={{ externalLinks }}
  >
    <Helmet
      defaultTitle="Open Targets Platform"
      titleTemplate="%s | Open Targets Platform"
    />
    {children}
  </Page>
);

export default BasePage;
