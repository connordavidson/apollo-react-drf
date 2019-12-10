import React from 'react';
import {
  Grid,
  Segment,
  Header,
  Item,
  Label,
  Button,
  Card,
  Divider,
  Dimmer,
  Loader,
  Image,
  Input,
  Checkbox,
  Icon,
  Message,
  Dropdown,
  Container,

} from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from "react-router";
import {connect} from 'react-redux';



import {
    productListURL,
    addToCartURL,
    productSearchListURL,
    categoryListURL,
    productSearchByCategoryURL,

  } from '../../../constants';

import {
    addItemToCart
  } from '../../../store/actions/cart';



class FeaturedItems extends React.Component {

  state = {
    loading: false,
    error: null,
    data: [],

    featuredCategories : [],
    featuredProductsTitle: 'Featured Items',
    filterTitle: '',
    filterCategory: '',
    filteredData: [],


  }

  componentDidMount(){
    this.setState({
      loading: true
    });
    this.handleGetProducts();
  }


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
      this.setState({data: response.data, loading: false, featuredCategories: cats});
    })
    .catch(error => {
      this.setState({error: error, loading: false});
    })
  }


  handleAddToCart = (data, quantity) => {
    this.setState({ loading: true });
    const {formData} = this.state;
    //filters  the data into the correct format fot the backend
    const variations = []
    this.props.addItemToCart(data, quantity, variations)
    this.setState({loading: false});

  }

  handleFilterDisplayCategoryButtonPressed = (e, data) => {
    console.log('onclick data: ', data)
    if(data.checked){
      //filterCategory is how the checkboxes uncheck when another is checked (the logic is in the 'checked' prop in the checkbox (category === checkedCategory))
      this.setState({
        filterCategory : data.name,
      })
      console.log('handleFilterButtonPressed data.name: ', data.name)
      //creates an array to handleFilterDisplayCategoryButtonPressed the filtered items, and loops through the state.data and compares it to the selected checkbox, if they match it is added to  the filteredData array
      let filteredItems = []
      this.state.data.map( item => {
        if(item.category === data.name){
          filteredItems = filteredItems.concat(item)
        }
      })
      console.log('handleFilterDisplayCategoryButtonPressed filtereditems: ', filteredItems)
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



  render(){
    const {
      loading,
      error,
      data,
      featuredCategories,
      featuredProductsTitle,
      filterTitle,
      filterCategory,
      filteredData,

    } = this.state

    return (
      <React.Fragment>
      <Grid.Column width={3}>
        <Header as='h3'>Categories</Header>
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
                  {//prints all the categories
                    featuredCategories.map(featuredCategories => {
                      return(
                        <Card.Content >
                          <Checkbox
                            label={featuredCategories}
                            float='middle'
                            onClick={(e, data) => {
                              this.handleFilterDisplayCategoryButtonPressed(e, data)
                              console.log('category: ', featuredCategories)
                            }}
                            name={featuredCategories}
                            checked={featuredCategories === filterCategory}
                          />
                        </Card.Content>
                      )
                  })}
              </Card>
            </Card.Group>
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
            <Header as='h1'>{featuredProductsTitle}{filterTitle}</Header>
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
                                    this.handleAddToCart(item, 1 )
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
                    // console.log('item from products: ' , item)
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
                                    this.handleAddToCart(item, 1 )
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

      </React.Fragment>

    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (data, quantity) => dispatch(addItemToCart(data, quantity)),

  }
}

export default
  withRouter(
    connect(
      null,
      mapDispatchToProps
    )
    (FeaturedItems)
  );
