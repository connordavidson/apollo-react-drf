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
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';


import {ProductList} from './ProductList';
import {fetchCart} from '../store/actions/cart';

import {productListURL, addToCartURL, productSearchListURL} from '../constants';

import {authAxios} from '../utils';

/*
WORK TO BE DONE:
  make a 'product item' component so that it can just get passed into the loops that create all the active items, instead of having all that code twice

*/




class BuyTab extends React.Component {

  state = {
    loading: false,
    error: null,
    data: [],
    categories: [],
    value: '',
    productsTitle: 'Featured Products',
    filterTitle: '',
    filterCategory: '',
    filteredData : [],

  }


  componentDidMount() {
    this.setState({
      loading: true
    });
    this.handleGetProducts();


  };



  handleGetProducts = () => {
    //gets the products from the database and stores them in the state or it returns the error
    axios
    .get(productListURL)
    .then(response => {
      //gets the individual categories from the response data
      let cats = []
      response.data.map( (item) => {
        if(!cats.includes(item.category)){
          cats = cats.concat(item.category)
        }
      })
      //console.log("response.data: " , response.data);
      this.setState({data: response.data, loading: false, categories: cats});
      // console.log('handlegetproducts data: ', response.data)
      // console.log('handlegetproducts state.data: ', this.state.data)
      // console.log('handlegetproducts categories: ', cats)

    })
    .catch(error => {
      this.setState({error: error, loading: false});
    })
  }


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
    //this.setState({value: data.value});
    //console.log('data from handleSearchEnterPress: ', data)
    let search = this.state.value

    // console.log('search from handleSearchEnterPress: ', search)
    if (event.key === "Enter") {
      //if the user hits enter (tries to search) then return the search results.. need to change the views.py for this a little bit
      axios
      .get(productSearchListURL, {
        params: {
          search: search
          }
        })
      .then(response => {

        //if the search bar is empty, make the title say 'featured products'
        //the issue is if the user searches for something, then erases it from the search bar and hits enter it'll say 'search results for "" []' when it is displaying the featured products
        if(search === ''){
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: 'Featured Products'}
          );
        }else{
          this.setState(
            {
              data: response.data,
              loading: false,
              productsTitle: `Search results for "${search}" [${response.data.length}]`}
          );
        }
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false
        });
      })
      // console.log('enter pressed');
    }
  }


  handleFilterButtonPressed = (e, data) => {
    console.log('onclick data: ', data)
    if(data.checked){
      //filterCategory is how the checkboxes uncheck when another is checked (the logic is in the 'checked' prop in the checkbox (category === checkedCategory))
      this.setState({
        filterCategory : data.name,
      })

      console.log('handleFilterButtonPressed data.name: ', data.name)
      //creates an array to hold the filtered items, and loops through the state.data and compares it to the selected checkbox, if they match it is added to  the filteredData array
      let filteredItems = []
      this.state.data.map( item => {
        if(item.category === data.name){
          filteredItems = filteredItems.concat(item)
        }
      })

      console.log('handlefilterbuttonpressed filtereditems: ', filteredItems)

      //filterTitle just displays the name of the filter category.. gets appended to the end of the products title on the page
      this.setState({
        filteredData: filteredItems ,
        filterTitle: `, filtered by "${data.name}"`
      })


    }else if (!data.checked){
      //sets the filter category to a blank string (this is incase the user checks the same box again )
      this.setState({
        filterCategory: '',
        filterTitle: ''
      })
    }
  }


  //this should be a component to create an item. make this so that it will display the product item, should get put in a loop when displaying the current items
  makeProductItem = (item) => {
    console.log('makeproductitem item: ' , item)
  }





  render(){

    const {
      data,
      error,
      loading,
      categories,
      value,
      productsTitle,
      filterCategory,
      filteredData,
      filterTitle,

     } = this.state;



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
                            <Checkbox
                              label={category}
                              float='middle'
                              onClick={(e, data) => {
                                this.handleFilterButtonPressed(e, data)
                                console.log('category: ', category)
                              }}
                              name={category}
                              checked={category === filterCategory}
                            />
                            <br />
                          </React.Fragment>
                        )
                    })}
                  </List>
                </Card>
              </Card.Group>

          )}

        </Grid.Column>

        {/*Doesn't work for some reason lol*/}
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
              <Header >{productsTitle}{filterTitle}</Header>
              <Divider />
              <Item.Group divided>



                { //prints out all the items
                  filterCategory !== '' ?
                  (
                    filteredData.map(item => {
                      return (
                        <Item key={item.id}>
                          <Item.Image
                            src={item.image}
                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                            style={{cursor: 'pointer'}}
                          />

                          <Item.Content>

                            <Item.Header
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                              {item.title}
                            </Item.Header>

                            <Item.Meta
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                              {
                                item.discount_price !== null ?
                                <span className='cinema'><s>${item.price}</s> ${item.discount_price}</span> :
                                <span className='cinema'>${item.price}</span>
                              }

                            </Item.Meta>

                            <Item.Description
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                                {item.description}
                            </Item.Description>

                            <Item.Extra>
                              {
                                item.variations.length === 0 ?
                                  <Button
                                    primary
                                    floated='right'
                                    icon
                                    onClick={ () => {
                                      this.handleAddToCart(item.slug, 1 )
                                      }
                                    }
                                    >
                                    Quick Add
                                    <Icon name='cart plus' floated='right' />
                                  </Button>
                                  :
                                  <Label
                                    primary
                                    icon
                                    onClick={() => this.props.history.push(`/products/${item.id}`)}
                                    style={{cursor: 'pointer' , float : 'right' }}
                                  >
                                    You need to select a {item.variations[0].name} option before you can order this
                                  </Label>
                              }
                            </Item.Extra>
                          </Item.Content>
                        </Item>
                      )
                    })

                  ):(
                    data.map(item => {
                      return (
                        <Item key={item.id}>
                          <Item.Image
                            src={item.image}
                            onClick={() => this.props.history.push(`/products/${item.id}`)}
                            style={{cursor: 'pointer'}}
                          />

                          <Item.Content>

                            <Item.Header
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                              {item.title}
                            </Item.Header>

                            <Item.Meta
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                              {
                                item.discount_price !== null ?
                                <span className='cinema'><s>${item.price}</s> ${item.discount_price}</span> :
                                <span className='cinema'>${item.price}</span>
                              }

                            </Item.Meta>

                            <Item.Description
                              onClick={() => this.props.history.push(`/products/${item.id}`)}
                              style={{cursor: 'pointer'}}
                            >
                                {item.description}
                            </Item.Description>

                            <Item.Extra>
                              {
                                item.variations.length === 0 ?
                                  <Button
                                    primary
                                    floated='right'
                                    icon
                                    onClick={ () => {
                                      this.handleAddToCart(item.slug, 1 )
                                      }
                                    }
                                    >
                                    Quick Add
                                    <Icon name='cart plus' floated='right' />
                                  </Button>
                                  :
                                  <Label
                                    primary
                                    icon
                                    onClick={() => this.props.history.push(`/products/${item.id}`)}
                                    style={{cursor: 'pointer' , float : 'right' }}
                                  >
                                    You need to select a {item.variations[0].name} option before you can order this
                                  </Label>
                              }
                            </Item.Extra>
                          </Item.Content>
                        </Item>
                      )
                    })
                  )
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


const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  }
}




export default
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )
    (BuyTab)
  );
