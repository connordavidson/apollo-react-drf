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
  Checkbox,
  Icon,

} from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from "react-router";
import {connect} from 'react-redux';
//found ItemsCarousel at https://reactjsexample.com/react-items-carousel/
import ItemsCarousel from 'react-items-carousel';


import {
    productListURL,
    addToCartURL,
    productSearchListURL,
    categoryListURL,
    productSearchByCategoryURL,
    subcategoryURL,

  } from '../../../constants';

import {
    addItemToCart
  } from '../../../store/actions/cart';



class CategoryItems extends React.Component {

  state = {
    loading: false,
    error: null,
    data: [],

    featuredCategories : [],
    // featuredProductsTitle: 'Featured Items',

    filterTitle: '',
    filterCategory: '',
    filteredData: [],

    activeItemIndex: 0,
    subCategories: []
  }

  componentDidMount(){
    this.setState({
      loading: true
    });
    this.handleGetProducts();
    this.handleGetSubCategories();
  }


  //this should be a component to create an item (it's a placeholder to remember to make the component). make this so that it will display the product item, should get put in a loop when displaying the current items
  makeProductItem = (item) => {
    console.log('makeproductitem item: ' , item)
  }


  handleGetSubCategories = () => {
    axios
    .get( subcategoryURL , {
      params: {
        category: this.props.category
        }
      })
    .then(response => {
      console.log('response.data from getSubCategories: ', response.data)
      this.setState({subCategories:response.data , loading: false})
    })
    .catch(error => {
      this.setState({error: error, loading: false})
    })

  }


  handleGetProducts = () => {
    //gets the products from the database and stores them in the state or it returns the error
    axios
    .get(productListURL)
    .then(response => {
      // //gets the individual categories from the response data
      // let cats = []
      // response.data.map( (item) => {
      //   if(!cats.includes(item.category)){
      //     cats = cats.concat(item.category)
      //   }
      // })
      this.setState({data: response.data, loading: false }) //, featuredCategories: cats});
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

  //for the carousel
  changeActiveItem = (activeItemIndex) => this.setState({ activeItemIndex });

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
      activeItemIndex,

    } = this.state

    const {
      category
    } = this.props

    // console.log('this.props: ', this.props)

    //used for slicing up the data from the db... just for "demo" purposes
    let carouselItems = data.slice(0,7)
    let recommendedItems = data.slice(3,5)
    let basedOnSearches = data.slice(5,8)


    return (

      <React.Fragment>
        {loading ? (
          <Segment>
              <Dimmer active inverted>
                <Loader inverted inline='centered'>Loading</Loader>
              </Dimmer>

          </Segment>
        ) : (

          <React.Fragment>
            <Grid.Column width={2}>
              <Header as='h3'>SubCategories here</Header>
              {/*displays the active categories.. styling needs work*/}
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

            </Grid.Column>




            <Grid.Column width={12}>
              <React.Fragment>
                <Header as='h1'>{category}</Header>

                <Divider />

                <Header as='h3'>Featured {category} Items</Header>
                <div
                  style={{border: '1px solid lightgrey' , borderRadius: '5px' }}
                >
                  <ItemsCarousel

                    infiniteLoop={true}
                    freeScrolling={true}

                    numberOfCards={4}
                    gutter={12}
                    showSlither={true}
                    firstAndLastGutter={true}


                    requestToChangeActive={this.changeActiveItem}
                    activeItemIndex={activeItemIndex}


                    chevronWidth={24}
                    rightChevron={<Icon size='large' name='chevron right'/>}
                    leftChevron={<Icon size='large' name='chevron left'/>}
                    outsideChevron={true}
                  >
                    {

                      carouselItems.map(item => {
                        // console.log('item from products: ' , item)
                        return (
                          <Card
                            key={item.id}
                            link
                            style={{marginTop: '15px', marginBotton: '15px'}}
                            raised
                          >
                            <Card.Content>
                              <Image
                                floated='right'
                                size='mini'
                                src={item.image}
                              />
                              <Card.Header
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {
                                  //trims the item title to create uniformity among the cards
                                  item.title.length > 22 ?
                                  item.title.substring(0,22) + '...' :
                                  item.title
                                }
                              </Card.Header>
                              <Card.Meta
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {
                                  item.discount_price !== null ?
                                  <span className='cinema'><s>${item.price}</s> ${item.discount_price}</span> :
                                  <span className='cinema'>${item.price}</span>
                                }
                              </Card.Meta>
                              <Card.Description
                                onClick={() => this.props.history.push(`/products/${item.id}`)}
                                style={{cursor: 'pointer'}}
                              >
                                {
                                  //trims the length of the description so that the cards aren't awkwardly long
                                  item.description.length > 75 ?
                                  item.description.substring(0, 75) + '...':
                                  item.description
                                }
                              </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
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
                            </Card.Content>
                          </Card>
                        )
                      })
                    }
                  </ItemsCarousel>
                </div>
                <Divider />


                <Grid>

                  <Grid.Column width={8}>

                    <div
                      style={{
                        border: '1px solid lightgrey' ,
                        padding: '5% 3% 3% 3%' ,
                        marginTop:'30px',
                        borderRadius: '5px'
                      }}
                    >
                      <Header as='h2' >
                        Recommended for you
                      </Header>

                      <Divider />

                      <Item.Group divided>

                        { //prints out all the items
                          recommendedItems.map(item => {
                            // console.log('item from products: ' , item)
                            return (
                              <Item key={item.id} link>
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
                                    {
                                        //trims the item title to create uniformity among the cards
                                        item.title.length > 46 ?
                                        item.title.substring(0,46) + '...' :
                                        item.title
                                    }
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
                                      {
                                        //trims the length of the description so that the cards aren't awkwardly long
                                        item.description.length > 125 ?
                                        item.description.substring(0, 125) + '...':
                                        item.description
                                      }
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
                        }
                      </Item.Group>
                    </div>
                  </Grid.Column>



                  <Grid.Column width={8}>

                    <div
                      style={{
                        border: '1px solid lightgrey' ,
                        padding: '5% 3% 3% 3%' ,
                        marginTop:'30px',
                        borderRadius: '5px'
                      }}
                    >

                      <Header as='h2'  >
                        Our Best {category} Deals (discounted items)
                      </Header>
                      <Divider />

                      <Item.Group divided>
                        {
                          basedOnSearches.map(item => {
                            return(
                              <Item>
                                <Item.Image
                                  size='tiny'
                                  src={item.image}
                                  onClick={() => this.props.history.push(`/products/${item.id}`)}
                                  style={{cursor: 'pointer'}}
                                />
                                <Item.Content verticalAlign='middle'>
                                  <Item.Header
                                    as='a'
                                    onClick={() => this.props.history.push(`/products/${item.id}`)}
                                    style={{cursor: 'pointer'}}
                                  >
                                    {
                                      //trims the item title to create uniformity among the cards
                                      item.title.length > 46 ?
                                      item.title.substring(0,46) + '...' :
                                      item.title
                                    }
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
                                </Item.Content>
                              </Item>
                            )
                          })
                        }
                      </Item.Group>
                    </div>
                  </Grid.Column>
                </Grid>


                <Divider />


                <Header as='h2'>
                  All Featured Items
                </Header>
                <Divider />
                <Item.Group divided>
                  { //prints out all the items
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
                  }
                </Item.Group>
              </React.Fragment>
            </Grid.Column>
          </React.Fragment>
        )}
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
    (CategoryItems)
  );
