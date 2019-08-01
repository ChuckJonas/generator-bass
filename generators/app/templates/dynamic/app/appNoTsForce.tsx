import { Card } from 'antd';
import { hot } from 'react-hot-loader'; // needs to be before react!
import * as React from 'react';

// example use of file loader to load image
import bassLogo from '@src/assets/images/bass-logo.jpg';

class App extends React.Component<{}, never> {

  constructor(props: any) {
    super(props);
  }



  public render() {
    return (
      <Card title='B.A.S.S.'>
        <img width={300} src={bassLogo} />
      </Card>
    );
  }
}

export default hot(module)(App);
