import React from 'react';

import {
  Grid,
  Search,
  Segment,
  Header,
  Menu,
  Item,
  Label,
  Container,
  Button,
  Card,
  Radio,
  Divider,
  List,
  Dimmer,
  Loader,
  Image,

} from 'semantic-ui-react';
import axios from 'axios';

import {ProductList} from './ProductList';

import {productListURL} from '../constants';

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
  state = {
    results: [],
    value: '',
    loading: false,
    error: null,
    data: [],
    categories: [],

  }



  componentDidMount() {

    this.setState({
      loading: true
    });

    //gets the products from the database and stores them in the state or it returns the error
    axios
    .get(productListURL)
    .then(response => {
      console.log("response.data: " , response.data);
      this.setState({data: response.data, loading: false});
    })
    .catch(error => {
      this.setState({error: error, loading: false});
    })

  };



  // data.map( (item, i) => {
  //   // console.log(i)
  //   // console.log('item ', item)
  //   if(!this.state.categories.includes(item.category)){
  //     //console.log("categories doesn't contain ", item.category);
  //     //cats = cats.concat(item.category);
  //     this.setState({
  //       categories: this.state.categories.concat(item.category)
  //     })
  //   }
  //   console.log("cats: ", this.state.category);
  // });

  // this.setState({
  //   categories: this.state.categories.concat(cats)
  // });









  //for the search bar
  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  // handleSearchChange = (e, { value }) => {
  //   this.setState({ loading: true, value })
  //
  //   setTimeout(() => {
  //     if (this.state.value.length < 1) return this.setState(initialState)
  //
  //     const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
  //     const isMatch = (result) => re.test(result.title)
  //
  //     this.setState({
  //       loading: false,
  //       //results: _.filter(source, isMatch),
  //     })
  //   }, 300)
  // }


  render(){
    const {data, error, loading, categories } = this.state;
    //console.log("data ", data);
    //adds every unique category (from data) to the categories in the state
    data.map( (item, i) => {
      if(!categories.includes(item.category)){
        this.setState({
          categories: this.state.categories.concat(item.category)
        })
      }
    });


    // var cats = [];
    //
    // data.map( (item, i) => {
    //   // console.log(i)
    //   // console.log('item ', item)
    //   if(!cats.includes(item.category)){
    //     console.log("categories doesn't contain ", item.category);
    //     cats = cats.concat(item.category);
    //     // this.setState({
    //     //   categories: this.state.categories.concat(item.category)
    //     // })
    //     console.log("cats array: ", cats);
    //   }
    //   console.log("cats: ", this.state.category);
    // });



    return(
      <Grid>
        <Grid.Row >
          <Grid.Column width={4}>
            <Search
              //makes the search fill the container
              input={{ fluid: true }}
              fluid
              // loading={loading}
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

          {loading ? (
              <Segment>
                  <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                  </Dimmer>

                  <Image src='/images/wireframe/short-paragraph.png' />
              </Segment>
            ) : (
              <List divided relaxed>

              {//prints all the categories
                categories.map(category => {
                  return(
                    <List.Item>
                      <List.Header>
                        <Radio floated='left' label={category} />
                      </List.Header>
                    </List.Item>
                  )
              })}


              </List>

          )}






        </Grid.Column>


        {loading ? (
            <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>

                <Image src='/images/wireframe/short-paragraph.png' />
            </Segment>
          ) : (

            <Grid.Column width={10}>
                <Header>Products</Header>
                <Item.Group >

                  { //prints out all the items
                    data.map(item => {
                    return (
                      <Card fluid className="ui segment centered">
                        <Item>
                          <Item.Image size='small' src={item.image} />
                          <Item.Content verticalAlign='middle'>
                            <Item.Header>{item.title} <Label floated='left'>{item.price}</Label></Item.Header>
                            <Item.Description>{item.description}</Item.Description>

                            <Item.Extra>
                              <Button floated='right'>Add to Cart</Button>
                            </Item.Extra>
                          </Item.Content>
                        </Item>
                      </Card>
                    )
                  })}

                </Item.Group>

            </Grid.Column>
          )}


      </Grid>
    )
  }
}


export default BuyTab;
