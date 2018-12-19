import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import OverviewTab from './OverviewTab';
import BrowserTab from './BrowserTab';

const query = gql`
  query PathwaysQuery($ensgId: String!) {
    target(ensgId: $ensgId) {
      id
      details {
        pathways {
          topLevelPathways {
            id
            name
            isAssociated
          }
          lowLevelPathways {
            id
            name
            parents {
              id
              name
            }
          }
        }
      }
    }
  }
`;

class PathwaysDetail extends React.Component {
  state = {
    tab: 'overview',
  };
  handleChange = (event, tab) => {
    this.setState({ tab });
  };
  render() {
    const { ensgId, symbol } = this.props;
    const { tab } = this.state;
    return (
      <React.Fragment>
        <Typography>Pathway information for {symbol} from Reactome</Typography>
        <Query query={query} variables={{ ensgId }}>
          {({ loading, error, data }) => {
            if (loading || error) return null;

            const {
              topLevelPathways,
              lowLevelPathways,
            } = data.target.details.pathways;
            return (
              <React.Fragment>
                <Tabs
                  value={tab}
                  onChange={this.handleChange}
                  scrollable
                  scrollButtons="auto"
                >
                  <Tab value="overview" label="Pathways Overview" />
                  <Tab value="browser" label="Reactome Pathway Browser" />
                </Tabs>
                {tab === 'overview' ? (
                  <OverviewTab
                    {...{ symbol, topLevelPathways, lowLevelPathways }}
                  />
                ) : null}
                {tab === 'browser' ? (
                  <BrowserTab
                    {...{ symbol, topLevelPathways, lowLevelPathways }}
                  />
                ) : null}
              </React.Fragment>
            );
          }}
        </Query>
      </React.Fragment>
    );
  }
}

export default PathwaysDetail;
