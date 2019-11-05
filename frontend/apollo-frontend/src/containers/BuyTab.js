import React from 'react';

import {
  Grid,
  Search,
  Segment,
  Header,
  Menu,

} from 'semantic-ui-react';



const initialState = { isLoading: false, results: [], value: '' }


/*
  Got the search bar from https://react.semantic-ui.com/modules/search/#types-standard


*/


// const source = _.times(5, () => ({
//   title: faker.company.companyName(),
//   description: faker.company.catchPhrase(),
//   image: faker.internet.avatar(),
//   price: faker.finance.amount(0, 100, 2, '$'),
// }))


class BuyTab extends React.Component {
  state = initialState;

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  // handleSearchChange = (e, { value }) => {
  //   this.setState({ isLoading: true, value })
  //
  //   setTimeout(() => {
  //     if (this.state.value.length < 1) return this.setState(initialState)
  //
  //     const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
  //     const isMatch = (result) => re.test(result.title)
  //
  //     this.setState({
  //       isLoading: false,
  //       //results: _.filter(source, isMatch),
  //     })
  //   }, 300)
  // }


  render(){
    return(
      <Grid>
        <Grid.Row >
          <Grid.Column width={4}>
            <Search
              style={{width: '100%' }}
              fluid
              // loading={isLoading}
              // onResultSelect={this.handleResultSelect}
              // onSearchChange={_.debounce(this.handleSearchChange, 500, {
              //   leading: true,
              // })}
              // results={results}
              // value={value}
              // {...this.props}
            />

            {/*
            <Grid.Column width={10}>
              <Segment>
                <Header>State</Header>
                <pre style={{ overflowX: 'auto' }}>
                  {JSON.stringify(this.state, null, 2)}
                </pre>
                <Header>Options</Header>
                <pre style={{ overflowX: 'auto' }}>
                  {JSON.stringify(source, null, 2)}
                </pre>
              </Segment>
            </Grid.Column>
            */}
          </Grid.Column>
        </Grid.Row>



        <Grid.Column width={4}>
          <Header>Categories</Header>
          <Menu fluid vertical>
            <Menu.Item className='header'>Dogs</Menu.Item>
            <Menu.Item>Poodle</Menu.Item>
            <Menu.Item>Cockerspaniel</Menu.Item>
          </Menu>
        </Grid.Column>


        <Grid.Column width={10}>
          <Header>Products</Header>
          <Menu fluid vertical>
            <Menu.Item className='header'>Dogs</Menu.Item>
            <Menu.Item>Poodle</Menu.Item>
            <Menu.Item>Cockerspaniel</Menu.Item>
          </Menu>
        </Grid.Column>


      </Grid>
    )
  }
}


export default BuyTab;
