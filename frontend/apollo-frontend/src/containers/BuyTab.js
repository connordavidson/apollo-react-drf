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
  Input,

} from 'semantic-ui-react';
import axios from 'axios';

//lets you recieve props from the parent component (in this case, NavigationTabs.js)
import { withRouter } from "react-router";

import {ProductList} from './ProductList';

import {productListURL} from '../constants';

/*
  Got the search bar from https://react.semantic-ui.com/modules/search/#types-standard
*/





class BuyTab extends React.Component {

  state = {
    loading: false,
    error: null,
    data: [],
    categories: [],
    value: '',

  }


  componentDidMount() {

    this.setState({
      loading: true
    });

    //gets the products from the database and stores them in the state or it returns the error
    axios
    .get(productListURL)
    .then(response => {
      //console.log("response.data: " , response.data);
      this.setState({data: response.data, loading: false});
    })
    .catch(error => {
      this.setState({error: error, loading: false});
    })

  };

  //if the user presses enter on the search bar, it'll search for the value (currently stored in this.state.value)
  handleSearchEnterPress = (event) => {
    if (event.key === "Enter") {

      //if the user hits enter (tries to search) then return the search results.. need to change the views.py for this a little bit
      axios
      .get(productListURL )
      .then(response => {
        console.log("response.data: " , response.data);
        this.setState({data: response.data, loading: false});
      })
      .catch(error => {
        this.setState({error: error, loading: false});
      })


      console.log('hey');
      alert("hey");
    }
  }



  render(){


    const {
      data,
      error,
      loading,
      categories,
      value,

     } = this.state;



    //console.log("data ", data);
    //adds every unique category (from data) to the categories in the state
    data.map( (item, i) => {
      if(!categories.includes(item.category)){
        this.setState({
          categories: this.state.categories.concat(item.category)
        })
      }
    });


    return(



      <Grid>

        <Grid.Row>
          <Grid.Column width={8}>
              <Input
              fluid
              icon='search'
              placeholder='Search...'
              onKeyPress={this.handleSearchEnterPress}
              onChange={
                //sets the search value into the value in the state
                (e,data)=>{
                  this.setState({value: data.value});
                  console.log('value ', value);
                }
              }
              />

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
              //displays the active categories.. styling needs work
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


        <Grid.Column width={10}>

        {loading ? (
            <Segment>
                <Dimmer active inverted>
                  <Loader inverted>Loading</Loader>
                </Dimmer>

                <Image src='/images/wireframe/short-paragraph.png' />
            </Segment>
          ) : (

            <React.Fragment>
              <Header>Products</Header>
              <Item.Group>

                { //prints out all the items
                  data.map(item => {
                  return (
                    <Card fluid className="ui segment centered">
                      <Item key={item.id}>
                        <Item.Image size='small' src={item.image} />
                        <Item.Content verticalAlign='middle'>
                          <Header
                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                            style={{cursor: 'pointer'}}
                          >
                            {item.title}
                            <Label floated='left'>{item.price}</Label>
                          </Header>
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
            </React.Fragment>
          )
        }
        </Grid.Column>

      </Grid>
    //ends the return statement
    )
  }
}


export default withRouter(BuyTab);
