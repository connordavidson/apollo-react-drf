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
  Form,
  Checkbox,
  Icon,
  Message,

} from 'semantic-ui-react';
import axios from 'axios';

//lets you recieve props from the parent component (in this case, NavigationTabs.js)
import { withRouter } from "react-router";

import {ProductList} from './ProductList';

import {productListURL, addToCartURL} from '../constants';

import {authAxios} from '../utils';



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
      console.log('resonse data: ', response.data)
    })
    .catch(error => {
      this.setState({error: error, loading: false});
    })

  };



  handleAddToCart = (slug, quantity) => {
    this.setState({ loading: true });
    const {formData} = this.state;
    //filters  the data into the correct format fot the backend
    const variations = []
    //authAxios makes sure that the user is signed in before adding to cart... just use axios for adding to cart while signed out
    authAxios
    .post( addToCartURL , { slug, variations, quantity} )
    .then(res => {
      //console.log(res.data, addToCartURL, "add to cart succeeded");
      this.props.fetchCart();
      this.setState({ loading: false, submitted: `${this.state.data.title} added to cart` });
    })
    .catch(err => {
      this.setState({ error: err, loading: false });
      console.log(err.message , 'add-to-cart failed ');
    });
  }


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
          <Grid.Column width={5}>
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


        <Grid.Column width={3}>
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

              <Card.Group>
                <Card>
                  <List divided relaxed>
                    {//prints all the categories
                      categories.map(category => {
                        return(
                          <React.Fragment>
                            <Form.Field
                              float='middle'
                              control={Checkbox}
                              label={<label>{category}</label>}
                            />
                            <br/>
                          </React.Fragment>
                        )
                    })}
                  </List>
                </Card>
              </Card.Group>

          )}

        </Grid.Column>

        <Divider vertical/>

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
              <Divider />
              <Item.Group divided>

                { //prints out all the items
                  data.map(item => {
                    return (
                      <Item key={item.id}>
                        <Item.Image src={item.image} />

                        <Item.Content>
                          <Item.Header
                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                            style={{cursor: 'pointer'}}
                          >
                            {item.title}
                          </Item.Header>
                          <Item.Meta>
                            <span className='cinema'>{item.price}</span>
                          </Item.Meta>
                          <Item.Description>
                              {item.description}
                          </Item.Description>
                          {
                            item.variations.length === 0 ?
                            <Item.Extra>
                              {/*make this a "quick add", but only if there are no variations to choose from */}
                              <Button
                                primary
                                floated='left'
                                icon
                                onClick={ () => this.handleAddToCart(item.slug, 1 ) }
                                >
                                Quick Add
                                <Icon name='cart plus' floated='right' />
                              </Button>
                            </Item.Extra>
                            :
                            <Item.Extra>
                              {/*make this a "quick add", but only if there are no variations to choose from */}
                              <Label primary floated='right' icon >
                                You need to select a {item.variations[0].name} option before you can order this
                              </Label>
                            </Item.Extra>
                          }

                        </Item.Content>
                      </Item>
                    )
                  })
                }

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
